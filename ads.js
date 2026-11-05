// ads.js - Monetization & Rewarded Ad Handling

function showAdModal() {
    const modal = document.getElementById('adModal');
    if (modal) modal.style.display = 'flex';
}

function closeAdModal() {
    const modal = document.getElementById('adModal');
    if (modal) modal.style.display = 'none';
}

function completeAdReward() {
    console.log("🎁 Ad watched successfully! Reward granted.");
    // TODO: Hook this up to grant an undo or power-up charge later
    closeAdModal();
}
