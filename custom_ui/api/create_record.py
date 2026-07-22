# -*- coding: utf-8 -*-
"""
Production-ready Frappe v16 API for dynamic record creation across any DocType.
Enforces strict dynamic permission verification checking if the logged-in user 
has 'create' and 'write' privileges before committing data to the database.

Location: apps/custom_ui/custom_ui/api/create_record.py
Route: /api/method/custom_ui.api.create_record.create_new_doc_record
"""

import frappe
from frappe import _
import json
from typing import Dict, Any, Optional
import traceback


@frappe.whitelist(allow_guest=False, methods=["POST"])
def create_new_doc_record(doctype: Optional[str] = None, doc_data: Optional[Any] = None) -> Dict[str, Any]:
    """
    Exposed API endpoint to dynamically create a new document record in any target DocType.
    Validates user session context and handles automatic parsing of nested JSON payload.
    """
    # 1. Block Guest Sessions strictly
    if frappe.session.user == "Guest":
        frappe.local.response["http_status_code"] = 401
        return {
            "success": False,
            "error_type": "Unauthorized",
            "message": "Authentication required. Please login first."
        }

    # 2. Extract and Parse Inputs
    params = frappe.local.form_dict
    target_doctype = doctype or params.get("doctype")
    raw_doc_data = doc_data or params.get("doc_data")

    if not target_doctype:
        frappe.local.response["http_status_code"] = 400
        return {
            "success": False,
            "error_type": "MissingParameter",
            "message": "Missing required parameter: 'doctype'."
        }

    if not raw_doc_data:
        frappe.local.response["http_status_code"] = 400
        return {
            "success": False,
            "error_type": "MissingParameter",
            "message": "Missing required parameter: 'doc_data'."
        }

    # Handle stringified JSON data if passed via raw form-data
    if isinstance(raw_doc_data, str):
        try:
            parsed_data = json.loads(raw_doc_data)
        except json.JSONDecodeError:
            frappe.local.response["http_status_code"] = 400
            return {
                "success": False,
                "error_type": "InvalidJSON",
                "message": "Failed to parse 'doc_data'. Ensure it is a valid JSON object."
            }
    else:
        parsed_data = raw_doc_data

    try:
        # 3. Dynamic Permission Check (Aukat Check for Creation)
        if not frappe.has_permission(target_doctype, "create"):
            frappe.local.response["http_status_code"] = 403
            return {
                "success": False,
                "error_type": "PermissionDenied",
                "message": f"User '{frappe.session.user}' does not have permission to create records in: {target_doctype}"
            }

        # 4. Initialize Document Object Structure
        # We explicitly set the doctype inside the payload dictionary
        parsed_data["doctype"] = target_doctype
        new_doc = frappe.get_doc(parsed_data)

        # 5. Execute standard validation hooks and inserts
        # This triggers Naming Rules, Before Insert hooks, and Mandatory Field validations
        new_doc.insert()

        # 6. Database Commit
        frappe.db.commit()

        # 7. Return complete metadata summary of the created document
        return {
            "success": True,
            "message": f"Record successfully created in '{target_doctype}'",
            "document_name": new_doc.name,
            "owner": new_doc.owner,
            "creation_timestamp": new_doc.creation,
            "doc_details": new_doc.as_dict()
        }

    except frappe.MandatoryError as me:
        # Occurs when any standard reqd/mandatory field is left out of payload
        frappe.db.rollback()
        frappe.local.response["http_status_code"] = 400
        return {
            "success": False,
            "error_type": "MissingMandatoryFields",
            "message": f"Validation Error: {str(me)}"
        }
    except frappe.ValidationError as ve:
        # Generic framework validation errors (e.g. invalid email format, dates)
        frappe.db.rollback()
        frappe.local.response["http_status_code"] = 422
        return {
            "success": False,
            "error_type": "ValidationError",
            "message": f"Data integrity validation failed: {str(ve)}"
        }
    except Exception as e:
        # Safety rollback for server crashes or data structural faults
        frappe.db.rollback()
        frappe.log_error(f"Dynamic Creation Engine Crash for {target_doctype}: {str(e)}", "Record Creation Error")
        frappe.local.response["http_status_code"] = 500
        return {
            "success": False,
            "error_type": "CreationEngineException",
            "message": f"System execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }