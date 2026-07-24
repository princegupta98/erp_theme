import frappe
from frappe import _
import json
from typing import Dict, Any, Optional, Union, List
import traceback

@frappe.whitelist(allow_guest=False, methods=["POST", "GET"])
def execute_doc_action(
    action: Optional[str] = None,
    doctype: Optional[str] = None,
    name: Optional[str] = None,
    data: Optional[Union[Dict[str, Any], str]] = None,
    filters: Optional[Union[Dict[str, Any], List[Any], str]] = None,
    fields: Optional[Union[List[str], str]] = None,
    limit: int = 20
) -> Dict[str, Any]:
    """
    Universal Dynamic CRUD API for Frappe.
    Supported Actions: 'create', 'get_list', 'get_doc', 'update', 'submit', 'cancel', 'delete'
    """
    try:
        # 1. Postman JSON body fallback parsing
        if frappe.request and frappe.request.data:
            try:
                raw_body = json.loads(frappe.request.data.decode("utf-8"))
                action = action or raw_body.get("action")
                doctype = doctype or raw_body.get("doctype")
                name = name or raw_body.get("name")
                data = data or raw_body.get("data")
                filters = filters or raw_body.get("filters")
                fields = fields or raw_body.get("fields")
                limit = raw_body.get("limit", limit)
            except Exception:
                pass  # Fallback to function argument parameters

        # Validation: Mandatory Fields Check
        if not action or not doctype:
            frappe.throw(_("Parameters 'action' and 'doctype' are required."))

        # Stringified JSON String handling (if parameters are sent as stringified JSON)
        if isinstance(data, str):
            data = json.loads(data)
        if isinstance(filters, str):
            filters = json.loads(filters)
        if isinstance(fields, str):
            fields = json.loads(fields)

        # -------------------------------------------------------------
        # ACTION 1: CREATE (Record banana)
        # -------------------------------------------------------------
        if action == "create":
            if not data:
                frappe.throw(_("Parameter 'data' (dictionary) is required for 'create' action."))
            
            doc = frappe.get_doc({"doctype": doctype, **data})
            doc.insert(ignore_permissions=False)
            return {
                "status": "success",
                "message": _(f"{doctype} record created successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 2: GET_LIST (Multiple Records fetch karna)
        # -------------------------------------------------------------
        elif action == "get_list":
            kwargs = {
                "doctype": doctype,
                "limit_page_length": limit,
                "ignore_permissions": False
            }
            if filters:
                kwargs["filters"] = filters
            if fields:
                kwargs["fields"] = fields
            else:
                kwargs["fields"] = ["*"]

            records = frappe.get_list(**kwargs)
            return {
                "status": "success",
                "count": len(records),
                "data": records
            }

        # -------------------------------------------------------------
        # ACTION 3: GET_DOC (Single Record Full Details)
        # -------------------------------------------------------------
        elif action == "get_doc":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'get_doc' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("read")
            return {
                "status": "success",
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 4: UPDATE (Field Values Edit Karna)
        # -------------------------------------------------------------
        elif action == "update":
            if not name or not data:
                frappe.throw(_("Both 'name' and 'data' are required for 'update' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("write")
            doc.update(data)
            doc.save(ignore_permissions=False)
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' updated successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 5: SUBMIT (DocType Submit Karna - docstatus: 1)
        # -------------------------------------------------------------
        elif action == "submit":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'submit' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("submit")
            doc.submit()
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' submitted successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 6: CANCEL (Submitted Doc Cancel Karna - docstatus: 2)
        # -------------------------------------------------------------
        elif action == "cancel":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'cancel' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("cancel")
            doc.cancel()
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' cancelled successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 7: DELETE (Record Permanently Delete Karna)
        # -------------------------------------------------------------
        elif action == "delete":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'delete' action."))
            
            frappe.delete_doc(doctype, name, ignore_permissions=False)
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' deleted successfully.")
            }

        else:
            frappe.throw(_(f"Invalid action '{action}'. Valid actions are: create, get_list, get_doc, update, submit, cancel, delete."))

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"CRUD API Error [{action or 'Unknown'}]")
        frappe.response["http_status_code"] = 400
        return {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc() if frappe.conf.developer_mode else None
        }