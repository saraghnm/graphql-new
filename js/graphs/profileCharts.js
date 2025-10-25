function generateSkillsBreakdown(skillsData) {
    if (!skillsData || skillsData.length === 0) {
        return '<p style="color: rgba(255,255,255,0.5);">No skills data available</p>';
    }
    
    const skillTotals = {};
    skillsData.forEach(skill => {
        const skillName = skill.type.replace('skill_', '');
        if (!skillTotals[skillName]) {
            skillTotals[skillName] = 0;
        }
        skillTotals[skillName] += skill.amount;
    });
    
    const topSkills = Object.entries(skillTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    const maxAmount = Math.max(...topSkills.map(s => s[1]));
    
    return `
        <div style="display: flex; flex-direction: column; gap: 16px;">
            ${topSkills.map(([skill, amount], index) => {
                const percentage = (amount / maxAmount) * 100;
                const color = index < 3 ? '#9DFF00' : index < 6 ? '#FFA600' : '#ffffff';
                
                return `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="min-width: 100px; font-size: 14px; font-weight: 600; color: ${color}; text-transform: capitalize;">
                            ${skill}
                        </div>
                        <div style="flex: 1; height: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; position: relative;">
                            <div style="height: 100%; background: ${color}; width: ${percentage}%; border-radius: 12px; transition: width 1s ease; box-shadow: 0 0 10px ${color}40;"></div>
                        </div>
                        <div style="min-width: 60px; text-align: right; font-size: 12px; color: rgba(255,255,255,0.6);">
                            ${(amount / 1000).toFixed(1)} KB
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateRecentActivity(activities) {
    if (!activities || activities.length === 0) {
        return '<p style="color: rgba(255,255,255,0.5);">No recent activity</p>';
    }
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    };
    
    return `
        <div style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
            ${activities.slice(0, 15).map((activity) => {
                let icon = '📦';
                let color = '#ffffff';
                let label = 'Activity';
                
                if (activity.type === 'xp') {
                    icon = '🎯';
                    color = '#9DFF00';
                    label = activity.object?.name || 'XP Gained';
                } else if (activity.type === 'up') {
                    icon = '✅';
                    color = '#9DFF00';
                    label = 'Audit Done';
                } else if (activity.type === 'down') {
                    icon = '📥';
                    color = '#FFA600';
                    label = 'Audit Received';
                }
                
                return `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; border-left: 3px solid ${color};">
                        <div style="font-size: 20px;">${icon}</div>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; font-weight: 600; color: ${color};">
                                ${label}
                            </div>
                            <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px;">
                                ${formatXP(activity.amount)} • ${timeAgo(activity.createdAt)}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateComparisonStats(userInfo, xpTransactions, aggregateStats) {
    if (!aggregateStats || !userInfo) {
        return '<p style="color: rgba(255,255,255,0.5);">Comparison data unavailable</p>';
    }
    
    const userTotalXP = calculateTotalXP(xpTransactions);
    const avgAuditRatio = aggregateStats.user_aggregate?.aggregate?.avg?.auditRatio || 1;
    const userAuditRatio = userInfo.auditRatio || 0;
    const auditRatioDiff = ((userAuditRatio - avgAuditRatio) / avgAuditRatio * 100).toFixed(0);
    const auditRatioAbove = userAuditRatio > avgAuditRatio;
    
    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            <div style="padding: 20px; background: rgba(157, 255, 0, 0.05); border-radius: 12px; border: 1px solid rgba(157, 255, 0, 0.2);">
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">YOUR XP</div>
                <div style="font-size: 28px; font-weight: 700; color: #9DFF00; margin-bottom: 4px;">
                    ${formatXP(userTotalXP)}
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                    Total Experience Points
                </div>
            </div>
            
            <div style="padding: 20px; background: rgba(255, 166, 0, 0.05); border-radius: 12px; border: 1px solid rgba(255, 166, 0, 0.2);">
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">YOUR AUDIT RATIO</div>
                <div style="font-size: 28px; font-weight: 700; color: #FFA600; margin-bottom: 4px;">
                    ${userAuditRatio.toFixed(2)}
                </div>
                <div style="font-size: 11px; color: ${auditRatioAbove ? '#9DFF00' : '#ef4444'};">
                    ${auditRatioAbove ? '↑' : '↓'} ${Math.abs(auditRatioDiff)}% ${auditRatioAbove ? 'above' : 'below'} average (${avgAuditRatio.toFixed(2)})
                </div>
            </div>
            
            <div style="padding: 20px; background: rgba(199, 202, 29, 0.03); border-radius: 12px; border: 1px solid rgba(245, 241, 34, 0.1);">
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">AVG PROJECT XP</div>
                <div style="font-size: 28px; font-weight: 700; color: #eafa0bff; margin-bottom: 4px;">
                    ${xpTransactions.length > 0 ? formatXP(userTotalXP / xpTransactions.length) : '0 KB'}
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                    Per project completed
                </div>
            </div>
        </div>
    `;
}