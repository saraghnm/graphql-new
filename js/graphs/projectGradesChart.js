function generateProjectGradesChart(projects) {
    if (!projects || projects.length === 0) {
        return '<p style="color: rgba(255,255,255,0.5);">No project data available</p>';
    }
    
    const recentProjects = projects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 15);
    
    const width = 800;
    const height = 400;
    const padding = 60;
    const barWidth = (width - padding * 2) / recentProjects.length - 10;

    const maxGrade = 5;
    
    return `
        <svg width="100%" height="400" viewBox="0 0 ${width} ${height}" style="max-width: 800px;">
            <!-- Grid lines -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" 
                  stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" 
                  stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            
            <!-- Horizontal grid lines for grade markers (0 to 5) -->
            ${[0, 1, 2, 3, 4, 5].map(gradeMarker => {
                const y = height - padding - (gradeMarker / maxGrade) * (height - padding * 2);
                return `
                    <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" 
                          stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="5,5"/>
                    <text x="${padding - 10}" y="${y + 5}" text-anchor="end" font-size="10" fill="rgba(255,255,255,0.4)">
                        ${gradeMarker}
                    </text>
                `;
            }).join('')}
            
            <!-- Bars with color based on grade -->
            ${recentProjects.map((project, index) => {
                const x = padding + index * ((width - padding * 2) / recentProjects.length);
                const grade = project.grade || 0;
                const barHeight = (grade / maxGrade) * (height - padding * 2);
                const y = height - padding - barHeight;
                
                let color = '#9DFF00';
                if (grade < 2.5) color = '#ef4444';
                else if (grade < 4) color = '#FFA600';
                
                return `
                    <rect 
                        x="${x + 5}" 
                        y="${y}" 
                        width="${barWidth}" 
                        height="${barHeight}" 
                        fill="${color}"
                        rx="6"
                        opacity="0.9"
                        style="filter: drop-shadow(0 0 8px ${color}40);"
                    >
                        <animate attributeName="height" from="0" to="${barHeight}" dur="0.8s" begin="${index * 0.05}s" fill="freeze"/>
                        <animate attributeName="y" from="${height - padding}" to="${y}" dur="0.8s" begin="${index * 0.05}s" fill="freeze"/>
                    </rect>
                    <text 
                        x="${x + barWidth / 2 + 5}" 
                        y="${y - 5}" 
                        text-anchor="middle" 
                        font-size="11" 
                        fill="${color}"
                        font-weight="600"
                    >
                        ${grade.toFixed(1)}
                    </text>
                    <text 
                        x="${x + barWidth / 2 + 5}" 
                        y="${height - padding + 15}" 
                        text-anchor="middle" 
                        font-size="9" 
                        fill="rgba(255,255,255,0.5)"
                        transform="rotate(-45, ${x + barWidth / 2 + 5}, ${height - padding + 15})"
                    >
                        ${project.object.name.substring(0, 12)}
                    </text>
                `;
            }).join('')}
            
            <!-- Title -->
            <text x="${padding}" y="${padding - 30}" font-size="16" fill="#ffffff" font-weight="600">
                Recent Completed Projects (Last 15)
            </text>
            <text x="${padding}" y="${padding - 12}" font-size="11" fill="rgba(255,255,255,0.5)">
                Grade Performance (Out of 5)
            </text>
        </svg>
    `;
}