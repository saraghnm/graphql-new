const GRAPHQL_URL = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';

let cachedUserInfo = null;
let cachedXPTransactions = null;

async function fetchUserInfo(forceRefresh = false) {
    if (cachedUserInfo && !forceRefresh) {
        return cachedUserInfo;
    }
    
    const token = getToken();
    
    const query = `
        query {
            user {
                id
                login
                firstName
                lastName
                email
                campus
                auditRatio
                totalUp
                totalDown
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
    
        cachedUserInfo = result.data.user[0];
        return cachedUserInfo;
        
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}

async function fetchUserXP(forceRefresh = false) {
    if (cachedXPTransactions && !forceRefresh) {
        return cachedXPTransactions;
    }
    
    const token = getToken();
    
    const query = `
        query {
            transaction(
                where: {
                    type: { _eq: "xp" }
                    path: { _like: "/bahrain/bh-module%" }
                }
                order_by: { createdAt: desc }
            ) {
                amount
                createdAt
                path
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
    
        cachedXPTransactions = result.data.transaction;
        return cachedXPTransactions;
        
    } catch (error) {
        console.error('Error fetching XP:', error);
        return [];
    }
}

let cachedProjects = null;

async function fetchCompletedProjects(forceRefresh = false) {
    if (cachedProjects && !forceRefresh) {
        return cachedProjects;
    }
    
    const token = getToken();
    
    const query = `
        query {
            progress(
                where: { 
                    isDone: { _eq: true }
                    object: { type: { _eq: "project" } }
                }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                isDone
                path
                createdAt
                object {
                    name
                    type
                }
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        cachedProjects = result.data.progress;
        return cachedProjects;
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

let cachedAuditTransactions = null;
async function fetchAuditTransactions(forceRefresh = false) {
    if (cachedAuditTransactions && !forceRefresh) {
        return cachedAuditTransactions;
    }
    
    const token = getToken();
    
    const query = `
        query {
            transaction(
                where: {
                    _or: [
                        { type: { _eq: "up" } }
                        { type: { _eq: "down" } }
                    ]
                }
            ) {
                id
                type
                amount
                createdAt
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        cachedAuditTransactions = result.data.transaction;
        return cachedAuditTransactions;
        
    } catch (error) {
        console.error('Error fetching audit transactions:', error);
        return [];
    }
}

let cachedSkills = null;
async function fetchSkills(forceRefresh = false) {
    if (cachedSkills && !forceRefresh) {
        return cachedSkills;
    }
    
    const token = getToken();
    
    const query = `
        query {
            transaction(
                where: {
                    type: { _regex: "skill_" }
                }
            ) {
                type
                amount
                createdAt
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        cachedSkills = result.data.transaction;
        return cachedSkills;
        
    } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
}

let cachedRecentActivity = null;
async function fetchRecentActivity(forceRefresh = false) {
    if (cachedRecentActivity && !forceRefresh) {
        return cachedRecentActivity;
    }
    
    const token = getToken();
    
    const query = `
        query {
            transaction(
                where: {
                    _or: [
                        { type: { _eq: "xp" } }
                        { type: { _eq: "up" } }
                        { type: { _eq: "down" } }
                    ]
                    path: { _like: "/bahrain/%" }
                }
                order_by: { createdAt: desc }
                limit: 20
            ) {
                id
                type
                amount
                createdAt
                path
                object {
                    name
                    type
                }
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        cachedRecentActivity = result.data.transaction;
        return cachedRecentActivity;
        
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
    }
}

let cachedAggregateStats = null;

async function fetchAggregateStats(forceRefresh = false) {
    if (cachedAggregateStats && !forceRefresh) {
        return cachedAggregateStats;
    }
    
    const token = getToken();
    
    const query = `
        query {
            user_aggregate {
                aggregate {
                    avg {
                        auditRatio
                    }
                    count
                }
            }
            transaction_aggregate(
                where: {
                    type: { _eq: "xp" }
                }
            ) {
                aggregate {
                    avg {
                        amount
                    }
                }
            }
        }
    `;
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        cachedAggregateStats = result.data;
        return cachedAggregateStats;
        
    } catch (error) {
        console.error('Error fetching aggregate stats:', error);
        return null;
    }
}

function clearDataCache() {
    cachedUserInfo = null;
    cachedXPTransactions = null;
    cachedProjects = null;
    cachedAuditTransactions = null;
    cachedSkills = null;
    cachedRecentActivity = null;
    cachedAggregateStats = null;
}

function calculateTotalXP(transactions) {
    return transactions.reduce((total, t) => total + t.amount, 0);
}

function formatXP(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + ' MB';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + ' KB';
    }
    return amount + ' B';
}