
function generateAuditDonutChart(auditTransactions) {
    if (!auditTransactions || auditTransactions.length === 0) {
        return '<p style="color: rgba(255,255,255,0.5);">No audit data available</p>';
    }
    
    const auditsDone = auditTransactions
        .filter(t => t.type === 'up')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const auditsReceived = auditTransactions
        .filter(t => t.type === 'down')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const total = auditsDone + auditsReceived;
    const auditRatio = auditsReceived > 0 ? (auditsDone / auditsReceived).toFixed(2) : '0';
 
    const donePercent = (auditsDone / total) * 100;
    const receivedPercent = (auditsReceived / total) * 100;

    const size = 280;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    const doneLength = (donePercent / 100) * circumference;
    const receivedLength = (receivedPercent / 100) * circumference;
    
    return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 24px;">
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
                <!-- Background circle -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    stroke-width="${strokeWidth}"
                />
                
                <!-- Audits Done segment (Green) -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="#9DFF00"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${doneLength} ${circumference}"
                    stroke-dashoffset="0"
                    stroke-linecap="round"
                    style="transition: stroke-dasharray 1s ease; filter: drop-shadow(0 0 8px rgba(157, 255, 0, 0.4));"
                />
                
                <!-- Audits Received segment (Orange) -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="#FFA600"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${receivedLength} ${circumference}"
                    stroke-dashoffset="${-doneLength}"
                    stroke-linecap="round"
                    style="transition: stroke-dasharray 1s ease, stroke-dashoffset 1s ease; filter: drop-shadow(0 0 8px rgba(255, 166, 0, 0.4));"
                />
                
                <!-- Center text (rotated back) -->
                <text
                    x="${size / 2}"
                    y="${size / 2 - 20}"
                    text-anchor="middle"
                    font-size="12"
                    fill="rgba(255,255,255,0.5)"
                    style="transform: rotate(90deg); transform-origin: center;"
                >
                    Audit Ratio
                </text>
                <text
                    x="${size / 2}"
                    y="${size / 2 + 20}"
                    text-anchor="middle"
                    font-size="48"
                    font-weight="700"
                    fill="#ffffff"
                    style="transform: rotate(90deg); transform-origin: center;"
                >
                    ${auditRatio}
                </text>
            </svg>
            
            <!-- Legend -->
            <div style="display: flex; gap: 32px; justify-content: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #9DFF00; border-radius: 4px; box-shadow: 0 0 8px rgba(157, 255, 0, 0.4);"></div>
                    <div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.5);">Audits Done</div>
                        <div style="font-size: 18px; font-weight: 700; color: #9DFF00;">${formatXP(auditsDone)}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #FFA600; border-radius: 4px; box-shadow: 0 0 8px rgba(255, 166, 0, 0.4);"></div>
                    <div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.5);">Audits Received</div>
                        <div style="font-size: 18px; font-weight: 700; color: #FFA600;">${formatXP(auditsReceived)}</div>
                    </div>
                </div>
            </div>
            
            <p style="text-align: center; color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">
                ${auditRatio >= 0.9 && auditRatio <= 1.1 ? '✓ Perfect balance!' : 
                  auditRatio < 0.9 ? '⚠ Need more audits done' : 
                  '⚠ Need more audits received'}
            </p>
        </div>
    `;
}