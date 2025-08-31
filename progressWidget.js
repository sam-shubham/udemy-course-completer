// === Create Overlay UI ===
const createOverlay = () => {
  let overlay = document.getElementById("progress-overlay");
  if (overlay) overlay.remove();

  overlay = document.createElement("div");
  overlay.id = "progress-overlay";
  overlay.style.position = "fixed";
  overlay.style.bottom = "20px";
  overlay.style.right = "20px";
  overlay.style.width = "300px";
  overlay.style.padding = "16px";
  overlay.style.background = "rgba(20,20,20,0.9)";
  overlay.style.color = "#fff";
  overlay.style.fontFamily = "Arial, sans-serif";
  overlay.style.borderRadius = "12px";
  overlay.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
  overlay.style.zIndex = "999999";

  overlay.innerHTML = `
    <div style="font-size:16px; font-weight:bold; margin-bottom:8px;">
      📊 Progress Tracker
    </div>
    <div style="height: 10px; background: #333; border-radius: 5px; overflow: hidden; margin-bottom: 10px;">
      <div id="progress-bar" style="height:100%; width:0%; background: linear-gradient(90deg,#4cafef,#00e676);"></div>
    </div>
    <div id="progress-text" style="font-size:14px; margin-bottom:5px;">
      0 / 0 completed
    </div>
    <div style="font-size:13px;">
      ⏳ Elapsed: <span id="elapsed">0s</span><br/>
      ⏱ Remaining: <span id="remaining">Calculating...</span>
    </div>
  `;
  document.body.appendChild(overlay);
};

// === Update Overlay ===
const updateOverlay = (completed, total, elapsed, avgTime) => {
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");
  const elapsedEl = document.getElementById("elapsed");
  const remainingEl = document.getElementById("remaining");

  if (!bar || !text) return;

  const percent = ((completed / total) * 100).toFixed(1);
  bar.style.width = percent + "%";
  text.innerText = `${completed} / ${total} completed (${percent}%)`;

  // Format time
  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  elapsedEl.innerText = fmt(elapsed);

  const remaining = (total - completed) * avgTime;
  remainingEl.innerText = remaining > 0 ? fmt(remaining) : "0s";
};

// === Your original functions ===
const incompleteItems = () =>
  Array.from(document.querySelectorAll('li')).filter(
    li =>
      Array.from(li.classList).some(c =>
        c.startsWith('curriculum-item-link--curriculum-item')
      ) &&
      !li.querySelector('input[type="checkbox"]:checked') &&
      !li.innerText.includes('Quiz')
  );

const expandAllSections = async () => {
  const togglers = document.querySelectorAll('.ud-accordion-panel-toggler');
  for (const toggler of togglers) {
    toggler.click();
    console.log('📂 Expanded section');
    await new Promise(res => setTimeout(res, 500));
  }
};

const completeVideo = async () => {
  const video = document.querySelector('video');
  if (!video) return;

  video.play();
  const targetTime = Math.max(0, video.duration - 5);
  video.currentTime = targetTime;
  video.play();

  await new Promise(res => setTimeout(res, 3000));
  console.log('✅ Completed The Video');
};

// === Main Flow with Progress UI ===
const runFlow = async () => {
  await expandAllSections();
  const items = incompleteItems();
  const total = items.length;
  let completed = 0;

  createOverlay();

  const startTime = Date.now();
  const avgTimes = [];

  for (const li of items) {
    const itemStart = Date.now();
    console.log('▶️ Working on:', li.innerText.trim());

    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    li.querySelector('.ud-focus-visible-target').click();

    await new Promise(res => setTimeout(res, 5000));
    await completeVideo();
    await new Promise(res => setTimeout(res, 1500));

    completed++;
    const elapsed = (Date.now() - startTime) / 1000;
    avgTimes.push((Date.now() - itemStart) / 1000);
    const avgTime = avgTimes.reduce((a, b) => a + b, 0) / avgTimes.length;

    updateOverlay(completed, total, elapsed, avgTime);
  }

  console.log('🎉 All items processed!');
};

// Run it
runFlow();
