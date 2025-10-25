function generateXPLineChart(transactions) {
    if (!transactions || transactions.length === 0) {
        return '<p style="color: rgba(255,255,255,0.5);">No XP data available</p>';
    }
    
    const sortedData = transactions.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    let cumulativeXP = 0;
    const dataPoints = sortedData.map(t => {
        cumulativeXP += t.amount;
        return {
            date: new Date(t.createdAt),
            xp: cumulativeXP
        };
    });
    
    const width = 800;
    const height = 300;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const minXP = Math.min(...dataPoints.map(d => d.xp));
    const maxXP = Math.max(...dataPoints.map(d => d.xp));
    const xpRange = maxXP - minXP;
    
    const paddedMin = minXP - (xpRange * 0.1);
    const paddedMax = maxXP + (xpRange * 0.1);
    const paddedRange = paddedMax - paddedMin;
 
    let pathData = '';
    dataPoints.forEach((point, index) => {
        const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
        const y = height - padding - ((point.xp - paddedMin) / paddedRange) * chartHeight;
        
        if (index === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });
    
    let areaPath = pathData + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
    
    return `
        <svg width="100%" height="300" viewBox="0 0 ${width} ${height}" style="max-width: 800px;">
            <!-- Grid lines -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" 
                  stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" 
                  stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            
            <!-- Gradient definition -->
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#9DFF00;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#9DFF00;stop-opacity:0.05" />
                </linearGradient>
            </defs>
            
            <!-- Area under line -->
            <path d="${areaPath}" fill="url(#lineGradient)" />
            
            <!-- Main line -->
            <path d="${pathData}" fill="none" stroke="#9DFF00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Data points -->
            ${dataPoints.map((point, index) => {
                const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
                const y = height - padding - ((point.xp - paddedMin) / paddedRange) * chartHeight;
                return `<circle cx="${x}" cy="${y}" r="5" fill="#9DFF00" stroke="#0d0d0d" stroke-width="2">
                    <animate attributeName="r" from="3" to="5" dur="0.5s" begin="0s" fill="freeze"/>
                </circle>`;
            }).join('')}
            
            <!-- Labels -->
            <text x="${padding}" y="${padding - 10}" font-size="14" fill="#9DFF00" font-weight="600">
                Total: ${formatXP(maxXP)}
            </text>
            <text x="${padding}" y="${height - 10}" font-size="12" fill="rgba(255,255,255,0.5)">
                Projects: ${dataPoints.length}
            </text>
        </svg>
    `;
}