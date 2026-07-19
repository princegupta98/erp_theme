// iot_dashboard.bundle.js - Official Frappe UI Standard Design with 5x2 Card Grid & 4 Charts

(function () {
    'use strict';

    let isRealtimeDashboardActive = false;
    let iotSocket = null;
    
    // 4 Native Frappe Charts Instances
    let tempChart = null;
    let metricsChart = null;
    let electricalChart = null;
    let efficiencyChart = null;

    let chartLabels = [];
    let tempHistory = [];
    let powerHistory = [];
    let voltHistory = [];
    let freqHistory = [];

    function renderReactDashboardView() {
        if (!isRealtimeDashboardActive) return;

        // Frappe top page-head wrapper standard hide
        const frappeHeader = document.querySelector('.page-head, header.page-head, .page-title-area');
        if (frappeHeader) {
            frappeHeader.style.setProperty('display', 'none', 'important');
        }

        const mainContentArea = document.querySelector('.page-container .page-content, #body_page, .layout-main-section');
        if (!mainContentArea) return;

        Array.from(mainContentArea.children).forEach(child => {
            if (child.id !== 'react-iot-root') {
                child.style.setProperty('display', 'none', 'important');
            }
        });

        let wrapper = document.getElementById('react-iot-root');
        if (wrapper) {
            wrapper.style.setProperty('display', 'block', 'important');
            initWebSocketConnection();
            return; 
        }

        // Standard Frappe Workspace Body Layout (Using Native CSS Variables)
        wrapper = document.createElement('div');
        wrapper.id = 'react-iot-root';
        wrapper.className = 'page-body workspace-body';
        wrapper.style.cssText = 'padding: 20px 30px; background-color: var(--bg-light-gray, #fafbfc); min-height: 100vh; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px;';

        // --- SECTION 1: Standard Frappe Page Title Bar ---
        const pageTitleBar = document.createElement('div');
        pageTitleBar.className = 'flex justify-between align-center';
        pageTitleBar.style.cssText = 'width: 100%; border-bottom: 1px solid var(--border-color, #e2e8f0); padding-bottom: 15px; margin-bottom: 5px;';
        pageTitleBar.innerHTML = `
            <div class="flex vertical">
                <div class="ellipsis text-muted" style="font-size: var(--text-xs, 11px); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Dashboards</div>
                <h1 class="page-title" style="font-size: var(--text-xl, 20px); font-weight: 600; color: var(--text-color, #1f2937); margin: 4px 0 0 0;">Industrial IoT Monitor</h1>
            </div>
            <div class="page-actions flex align-center" style="gap: 12px;">
                <div id="ws-status-badge" class="indicator red" style="background-color: var(--bg-white, #fff); border: 1px solid var(--border-color, #e2e8f0); padding: 5px 12px; border-radius: var(--border-radius-sm, 4px); font-size: var(--text-xs, 11px); font-weight: 500; color: var(--text-danger, #ef4444); display: flex; align-items: center; gap: 6px; box-shadow: var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05)); cursor: default;">
                    <span class="indicator-pill red" style="width: 6px; height: 6px; background-color: var(--text-danger, #ef4444); border-radius: 50%;"></span>
                    Disconnected
                </div>
            </div>
        `;
        wrapper.appendChild(pageTitleBar);

        // --- SECTION 2: Official Frappe Number Card Grid (Symmetrical 5 Columns Grid) ---
        const numberCardGrid = document.createElement('div');
        numberCardGrid.className = 'grid-list-filters dashboard-section-container';
        // Enforcing 5 columns strictly for both rows to perfectly utilize empty space
        numberCardGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; width: 100%; margin-bottom: 10px;';

        const metricsConfig = [
            // Row 1 Cards (Upar ke 5)
            { id: 'temperature', label: 'Temperature', unit: '°C', icon: '🔥' },
            { id: 'vibration', label: 'Vibration', unit: 'mm/s', icon: '🎛️' },
            { id: 'rpm', label: 'Engine RPM', unit: 'RPM', icon: '⚙️' },
            { id: 'pressure', label: 'Pressure', unit: 'bar', icon: '💨' },
            { id: 'voltage', label: 'Voltage', unit: 'V', icon: '⚡' },
            
            // Row 2 Cards (Niche ke 5)
            { id: 'current', label: 'Current', unit: 'A', icon: '🔌' },
            { id: 'power', label: 'Power', unit: 'kW', icon: '🔋' },
            { id: 'energy', label: 'Energy', unit: 'kWh', icon: '📊' },
            { id: 'frequency', label: 'Frequency', unit: 'Hz', icon: '〰️' },
            { id: 'torque', label: 'Torque', unit: 'Nm', icon: '🔧' }
        ];

        metricsConfig.forEach(metric => {
            const card = document.createElement('div');
            card.className = 'widget widget-card';
            card.style.cssText = 'background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-md, 6px); padding: 16px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05)); display: flex; justify-content: space-between; align-items: flex-start; min-height: 85px; box-sizing: border-box;';
            card.innerHTML = `
                <div class="flex vertical" style="flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                    <span class="widget-title text-muted" style="font-size: var(--text-xs, 12px); font-weight: 500; letter-spacing: 0.2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-muted, #6b7280);">${metric.label}</span>
                    <div style="display: flex; align-items: baseline; margin-top: 8px;">
                        <span class="widget-value" id="iot-${metric.id}" style="font-size: var(--text-2xl, 22px); font-weight: 700; color: var(--text-color, #1f2937); line-height: 1;">0</span>
                        <span class="widget-unit text-muted" style="font-size: var(--text-xs, 11px); font-weight: 500; margin-left: 4px; color: var(--text-muted, #9ca3af);">${metric.unit}</span>
                    </div>
                </div>
                <div class="widget-icon" style="font-size: 16px; width: 28px; height: 28px; border-radius: var(--border-radius-sm, 4px); background-color: var(--control-bg, #f8fafc); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color, #f1f5f9); margin-left: 10px;">
                    ${metric.icon}
                </div>
            `;
            numberCardGrid.appendChild(card);
        });
        wrapper.appendChild(numberCardGrid);

        // --- SECTION 3: 4-Grid Frappe Chart Container Layout ---
        const chartGrid = document.createElement('div');
        chartGrid.className = 'dashboard-charts-container';
        chartGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; align-items: stretch; margin-bottom: 20px;';
        
        // Chart 1: Telemetry Trends (Line Chart)
        const chartCol1 = document.createElement('div');
        chartCol1.className = 'widget widget-card chart-widget';
        chartCol1.style.cssText = 'background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-lg, 8px); padding: 20px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05)); display: flex; flex-direction: column;';
        chartCol1.innerHTML = `
            <div class="widget-head flex justify-between align-center" style="margin-bottom: 14px; border-bottom: 1px solid var(--border-color, #f1f5f9); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div class="widget-label" style="font-size: var(--text-md, 14px); font-weight: 600; color: var(--text-color, #1f2937);">Telemetry Dynamics Trend</div>
                <div class="widget-actions btn-group" style="display: flex; gap: 6px;">
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📅 Last Year</button>
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📊 Monthly</button>
                    <span style="cursor: pointer; padding: 0 4px; font-size: 14px; color: var(--text-muted, #6b7280);">···</span>
                </div>
            </div>
            <div class="text-muted" style="font-size: var(--text-xs, 11px); color: var(--text-muted, #9ca3af); margin-bottom: 16px;">Last synced just now</div>
            <div style="flex-grow: 1; min-height: 250px; width: 100%; display: flex; align-items: center;">
                <div id="temp-live-chart" style="width: 100%; height: 250px;"></div>
            </div>
        `;
        chartGrid.appendChild(chartCol1);

        // Chart 2: Load Metrics (Bar Chart)
        const chartCol2 = document.createElement('div');
        chartCol2.className = 'widget widget-card chart-widget';
        chartCol2.style.cssText = 'background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-lg, 8px); padding: 20px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05)); display: flex; flex-direction: column;';
        chartCol2.innerHTML = `
            <div class="widget-head flex justify-between align-center" style="margin-bottom: 14px; border-bottom: 1px solid var(--border-color, #f1f5f9); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div class="widget-label" style="font-size: var(--text-md, 14px); font-weight: 600; color: var(--text-color, #1f2937);">Completed Operation Comparison</div>
                <div class="widget-actions btn-group" style="display: flex; gap: 6px;">
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📅 Last Year</button>
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📊 Quarterly</button>
                    <span style="cursor: pointer; padding: 0 4px; font-size: 14px; color: var(--text-muted, #6b7280);">···</span>
                </div>
            </div>
            <div class="text-muted" style="font-size: var(--text-xs, 11px); color: var(--text-muted, #9ca3af); margin-bottom: 16px;">Last synced just now</div>
            <div style="flex-grow: 1; min-height: 250px; width: 100%; display: flex; align-items: center;">
                <div id="metrics-comparison-chart" style="width: 100%; height: 250px;"></div>
            </div>
        `;
        chartGrid.appendChild(chartCol2);

        // Chart 3: Voltage & Frequency stability (Line Chart)
        const chartCol3 = document.createElement('div');
        chartCol3.className = 'widget widget-card chart-widget';
        chartCol3.style.cssText = 'background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-lg, 8px); padding: 20px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05)); display: flex; flex-direction: column;';
        chartCol3.innerHTML = `
            <div class="widget-head flex justify-between align-center" style="margin-bottom: 14px; border-bottom: 1px solid var(--border-color, #f1f5f9); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div class="widget-label" style="font-size: var(--text-md, 14px); font-weight: 600; color: var(--text-color, #1f2937);">Electrical Grid Stability</div>
                <div class="widget-actions btn-group" style="display: flex; gap: 6px;">
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📅 Last Year</button>
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📊 Realtime</button>
                    <span style="cursor: pointer; padding: 0 4px; font-size: 14px; color: var(--text-muted, #6b7280);">···</span>
                </div>
            </div>
            <div class="text-muted" style="font-size: var(--text-xs, 11px); color: var(--text-muted, #9ca3af); margin-bottom: 16px;">Last synced just now</div>
            <div style="flex-grow: 1; min-height: 250px; width: 100%; display: flex; align-items: center;">
                <div id="electrical-grid-chart" style="width: 100%; height: 250px;"></div>
            </div>
        `;
        chartGrid.appendChild(chartCol3);

        // Chart 4: Engine RPM & Power efficiency (Bar Chart)
        const chartCol4 = document.createElement('div');
        chartCol4.className = 'widget widget-card chart-widget';
        chartCol4.style.cssText = 'background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-lg, 8px); padding: 20px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05)); display: flex; flex-direction: column;';
        chartCol4.innerHTML = `
            <div class="widget-head flex justify-between align-center" style="margin-bottom: 14px; border-bottom: 1px solid var(--border-color, #f1f5f9); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div class="widget-label" style="font-size: var(--text-md, 14px); font-weight: 600; color: var(--text-color, #1f2937);">Dynamic Power Efficiency KPI</div>
                <div class="widget-actions btn-group" style="display: flex; gap: 6px;">
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📅 Last Year</button>
                    <button class="btn btn-default btn-xs" style="background-color: var(--control-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: var(--border-radius-sm, 4px); padding: 3px 8px; font-size: var(--text-xs, 11px); color: var(--text-color, #1f2937);">📊 Monthly</button>
                    <span style="cursor: pointer; padding: 0 4px; font-size: 14px; color: var(--text-muted, #6b7280);">···</span>
                </div>
            </div>
            <div class="text-muted" style="font-size: var(--text-xs, 11px); color: var(--text-muted, #9ca3af); margin-bottom: 16px;">Last synced just now</div>
            <div style="flex-grow: 1; min-height: 250px; width: 100%; display: flex; align-items: center;">
                <div id="efficiency-kpi-chart" style="width: 100%; height: 250px;"></div>
            </div>
        `;
        chartGrid.appendChild(chartCol4);

        wrapper.appendChild(chartGrid);
        mainContentArea.appendChild(wrapper);

        // Native Initializations
        setTimeout(() => {
            initFrappeCharts();
            initWebSocketConnection();
        }, 200);
    }

    function initFrappeCharts() {
        // Chart 1 Init: Temperature vs Power (Line)
        tempChart = new frappe.Chart("#temp-live-chart", {
            data: {
                labels: ["Initial"],
                datasets: [
                    { name: "Temperature (°C)", values: [0] },
                    { name: "Power Load (kW)", values: [0] }
                ]
            },
            type: 'line',
            height: 250,
            colors: ['#ff5858', '#3b82f6'],
            lineOptions: { dotSize: 4, regionFill: 0 }
        });

        // Chart 2 Init: Mechanical Loads (Bar)
        metricsChart = new frappe.Chart("#metrics-comparison-chart", {
            data: {
                labels: ["Vibration (mm/s)", "Pressure (bar)", "Current (A)", "Torque Force (Nm)"],
                datasets: [{ name: "Mechanical Load Matrix", values: [0, 0, 0, 0] }]
            },
            type: 'bar',
            height: 250,
            colors: ['#10b981']
        });

        // Chart 3 Init: Electrical Grid Stability (Line)
        electricalChart = new frappe.Chart("#electrical-grid-chart", {
            data: {
                labels: ["Initial"],
                datasets: [
                    { name: "Voltage (V)", values: [0] },
                    { name: "Frequency (Hz)", values: [0] }
                ]
            },
            type: 'line',
            height: 250,
            colors: ['#eab308', '#a855f7'],
            lineOptions: { dotSize: 4, regionFill: 0 }
        });

        // Chart 4 Init: Engine KPIs (Bar/Percentage)
        efficiencyChart = new frappe.Chart("#efficiency-kpi-chart", {
            data: {
                labels: ["Engine RPM (x10)", "Energy (kWh)", "Efficiency Status (%)"],
                datasets: [{ name: "Performance Indexes", values: [0, 0, 0] }]
            },
            type: 'bar',
            height: 250,
            colors: ['#f97316']
        });
    }

    function initWebSocketConnection() {
        if (iotSocket && iotSocket.readyState === WebSocket.OPEN) return;

        iotSocket = new WebSocket("ws://127.0.0.1:8001/ws/sensor");

        iotSocket.onopen = () => {
            iotSocket.send("start");
            const badge = document.getElementById('ws-status-badge');
            if (badge) {
                badge.className = 'indicator green';
                badge.style.cssText = 'border: 1px solid var(--border-color, #bbf7d0); background-color: var(--bg-white, #fff); color: var(--text-success, #16a34a); padding: 5px 12px; border-radius: var(--border-radius-sm, 4px); font-size: var(--text-xs, 11px); font-weight: 500; display: flex; align-items: center; gap: 6px; box-shadow: var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05));';
                badge.innerHTML = `<span class="indicator-pill green" style="width: 6px; height: 6px; background-color: var(--text-success, #16a34a); border-radius: 50%;"></span> Live Stream Connected`;
            }
        };

        iotSocket.onmessage = (event) => {
            if (!isRealtimeDashboardActive) return;
            
            try {
                const data = JSON.parse(event.data);
                
                // Realtime Numbers Bind
                const fields = ['temperature', 'vibration', 'rpm', 'pressure', 'voltage', 'current', 'power', 'energy', 'frequency', 'torque'];
                fields.forEach(f => {
                    const el = document.getElementById(`iot-${f}`);
                    if (el && data[f] !== undefined) el.innerText = data[f];
                });

                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                // Stream Plotting Engine: Chart 1 (Temp & Power)
                if (tempChart && data.temperature !== undefined && data.power !== undefined) {
                    tempHistory.push(parseFloat(data.temperature));
                    powerHistory.push(parseFloat(data.power));
                }

                // Stream Plotting Engine: Chart 3 (Voltage & Frequency)
                if (electricalChart && data.voltage !== undefined && data.frequency !== undefined) {
                    voltHistory.push(parseFloat(data.voltage));
                    freqHistory.push(parseFloat(data.frequency));
                }

                // Global timeline alignment update
                chartLabels.push(currentTime);
                if (chartLabels.length > 10) {
                    chartLabels.shift();
                    tempHistory.shift();
                    powerHistory.shift();
                    voltHistory.shift();
                    freqHistory.shift();
                }

                // Update Line Graphs Natively
                if (tempChart) {
                    tempChart.update({
                        labels: chartLabels,
                        datasets: [
                            { values: tempHistory },
                            { values: powerHistory }
                        ]
                    });
                }

                if (electricalChart) {
                    electricalChart.update({
                        labels: chartLabels,
                        datasets: [
                            { values: voltHistory },
                            { values: freqHistory }
                        ]
                    });
                }

                // Update Bar Graph 2 (Mechanical Loads)
                if (metricsChart) {
                    const vib = parseFloat(data.vibration) || 0;
                    const pres = parseFloat(data.pressure) || 0;
                    const cur = parseFloat(data.current) || 0;
                    const torq = parseFloat(data.torque) || 0;

                    metricsChart.update({
                        labels: ["Vibration (mm/s)", "Pressure (bar)", "Current (A)", "Torque Force (Nm)"],
                        datasets: [{ values: [vib, pres, cur, torq] }]
                    });
                }

                // Update Bar Graph 4 (Efficiency Status)
                if (efficiencyChart) {
                    const scaledRpm = (parseFloat(data.rpm) / 10) || 0; 
                    const energy = parseFloat(data.energy) || 0;
                    const mockEfficiency = Math.min(100, Math.max(10, Math.round((scaledRpm > 0 ? (energy / scaledRpm) * 100 : 85))));

                    efficiencyChart.update({
                        labels: ["Engine RPM (x10)", "Energy (kWh)", "Efficiency Status (%)"],
                        datasets: [{ values: [scaledRpm, energy, mockEfficiency] }]
                    });
                }

            } catch (err) {
                console.error("Layout refresh sync error: ", err);
            }
        };

        iotSocket.onclose = () => {
            const badge = document.getElementById('ws-status-badge');
            if (badge) {
                badge.className = 'indicator red';
                badge.style.cssText = 'border: 1px solid var(--border-color, #fecaca); background-color: var(--bg-white, #fff); color: var(--text-danger, #ef4444); padding: 5px 12px; border-radius: var(--border-radius-sm, 4px); font-size: var(--text-xs, 11px); font-weight: 500; display: flex; align-items: center; gap: 6px; box-shadow: var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05));';
                badge.innerHTML = `<span class="indicator-pill red" style="width: 6px; height: 6px; background-color: var(--text-danger, #ef4444); border-radius: 50%;"></span> Offline`;
            }
            if (isRealtimeDashboardActive) {
                setTimeout(initWebSocketConnection, 4000);
            }
        };
    }

    function restoreFrappeView() {
        isRealtimeDashboardActive = false;
        if (iotSocket) {
            iotSocket.close();
            iotSocket = null;
        }

        const root = document.getElementById('react-iot-root');
        if (root) root.style.setProperty('display', 'none', 'important');

        const mainContentArea = document.querySelector('.page-container .page-content, #body_page, .layout-main-section');
        if (mainContentArea) {
            Array.from(mainContentArea.children).forEach(child => {
                if (child.id !== 'react-iot-root') child.style.removeProperty('display');
            });
        }
        
        const frappeHeader = document.querySelector('.page-head, header.page-head, .page-title-area');
        if (frappeHeader) frappeHeader.style.removeProperty('display');
    }

    function bindSidebarHooks() {
        const anchors = document.querySelectorAll('.sidebar-item-container .item-anchor');
        anchors.forEach(anchor => {
            const labelSpan = anchor.querySelector('.sidebar-item-label');
            if (labelSpan && labelSpan.innerText.trim() === 'Realtime Dashboard') {
                if (!anchor.dataset.hooked) {
                    anchor.dataset.hooked = 'true';
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault(); 
                        e.stopPropagation();

                        document.querySelectorAll('.standard-sidebar-item').forEach(el => el.classList.remove('active-sidebar'));
                        const parentSidebarItem = this.closest('.standard-sidebar-item');
                        if (parentSidebarItem) parentSidebarItem.classList.add('active-sidebar');

                        isRealtimeDashboardActive = true;
                        renderReactDashboardView();
                    });
                }
            } else if (labelSpan) {
                if (!anchor.dataset.destroyHooked) {
                    anchor.dataset.destroyHooked = 'true';
                    anchor.addEventListener('click', function() {
                        restoreFrappeView();
                    });
                }
            }
        });
    }

    $(document).on('page-change', function() {
        if (frappe.get_route()[1] !== 'realtime-iot-dashboard') restoreFrappeView();
        setTimeout(bindSidebarHooks, 500);
    });

    setInterval(bindSidebarHooks, 1000);

})();