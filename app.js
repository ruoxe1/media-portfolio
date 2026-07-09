const defaultWorks = [
  {
    id: "sanfu-ad",
    title: "三福广告《潮这儿看，够有趣》",
    type: "AIGC 广告",
    duration: "00:30",
    category: "aigc",
    video: "./assets/videos/sanfu-ad.mp4",
    summary:
      "围绕年轻潮流、门店氛围与商品趣味卖点完成广告创意，使用 AI 生成镜头并完成剪辑包装。",
    roles: ["广告创意策划与脚本文案", "可灵 AI 镜头生成与素材筛选", "剪映节奏剪辑、字幕转场与配乐包装"],
  },
  {
    id: "cheng",
    title: "《战争前线》",
    type: "短视频剪辑",
    duration: "00:56",
    category: "edit",
    video: "./assets/videos/cheng.mp4",
    summary:
      "以成片节奏、画面衔接和情绪推进为核心，展示短视频从素材到完成品的剪辑能力。",
    roles: ["素材筛选与粗剪", "节奏调整与画面衔接", "字幕、转场和基础后期包装"],
  },
  {
    id: "city-owner",
    title: "《城主的自我修养》",
    type: "剧情表达",
    duration: "00:46",
    category: "story",
    video: "./assets/videos/city-owner.mp4",
    summary:
      "偏剧情/游戏向的短片表达，重点呈现内容节奏、标题感和观看记忆点。",
    roles: ["内容结构整理", "剪辑节奏与氛围营造", "成片输出与传播场景适配"],
  },
  {
    id: "vlog",
    title: "Vlog 影像作品",
    type: "生活记录",
    duration: "01:02",
    category: "edit",
    video: "./assets/videos/vlog.mp4",
    summary:
      "以日常观察和移动拍摄为基础，展示生活化镜头组织、节奏控制和短视频叙事能力。",
    roles: ["拍摄素材整理与筛选", "Vlog 节奏剪辑与画面串联", "音乐、字幕和成片输出适配"],
  },
];

const worksGrid = document.querySelector("#works-grid");
const chips = document.querySelectorAll("[data-filter]");
const heroVideo = document.querySelector(".reel-frame video");
const heroToggle = document.querySelector("[data-video-toggle]");
const workForm = document.querySelector("#work-form");
const formStatus = document.querySelector("#form-status");
const statsCount = document.querySelector(".quick-stats dt");
const DB_NAME = "portfolioWorks";
const STORE_NAME = "works";
let customWorks = [];
let activeFilter = "all";

function openWorksDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readCustomWorks() {
  const db = await openWorksDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function saveCustomWork(work) {
  const db = await openWorksDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(work);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function deleteCustomWork(id) {
  const db = await openWorksDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

function getAllWorks() {
  return [
    ...defaultWorks,
    ...customWorks.map((work) => ({
      ...work,
      category: work.category || "custom",
      isCustom: true,
      video: URL.createObjectURL(work.videoBlob),
    })),
  ];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderWorks(filter = "all") {
  const visibleWorks = getAllWorks().filter((work) => filter === "all" || work.category === filter);
  statsCount.textContent = String(defaultWorks.length + customWorks.length);

  worksGrid.innerHTML = visibleWorks
    .map(
      (work) => `
        <article class="work-card" data-category="${escapeHtml(work.category)}">
          <div class="work-media">
            <video src="${escapeHtml(work.video)}" controls preload="none" playsinline aria-label="${escapeHtml(work.title)}"></video>
          </div>
          <div class="work-body">
            <div class="work-meta">
              <span>${escapeHtml(work.type)}</span>
              <span>${escapeHtml(work.duration || "未标注时长")}</span>
            </div>
            <h3>${escapeHtml(work.title)}</h3>
            <p>${escapeHtml(work.summary)}</p>
            <ul class="role-list">
              ${work.roles.map((role) => `<li>${escapeHtml(role)}</li>`).join("")}
            </ul>
            ${
              work.isCustom
                ? `<div class="work-actions"><button class="delete-work" type="button" data-delete-work="${escapeHtml(work.id)}">删除作品</button></div>`
                : ""
            }
          </div>
        </article>
      `,
    )
    .join("");
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderWorks(activeFilter);
  });
});

heroToggle.addEventListener("click", async () => {
  if (heroVideo.paused) {
    await heroVideo.play();
    heroToggle.textContent = "暂停精选";
  } else {
    heroVideo.pause();
    heroToggle.textContent = "播放精选";
  }
});

heroVideo.addEventListener("ended", () => {
  heroToggle.textContent = "播放精选";
});

worksGrid.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-delete-work]");
  if (!deleteButton) return;

  await deleteCustomWork(deleteButton.dataset.deleteWork);
  customWorks = await readCustomWorks();
  renderWorks(activeFilter);
  formStatus.textContent = "已删除新增作品。";
});

workForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "正在保存作品...";

  const formData = new FormData(workForm);
  const videoFile = formData.get("video");

  if (!videoFile || videoFile.size === 0) {
    formStatus.textContent = "请先选择一个视频文件。";
    return;
  }

  const roles = String(formData.get("roles"))
    .split(/\r?\n/)
    .map((role) => role.trim())
    .filter(Boolean);

  const work = {
    id: `custom-${Date.now()}`,
    title: String(formData.get("title")).trim(),
    type: String(formData.get("type")).trim(),
    duration: String(formData.get("duration")).trim(),
    category: String(formData.get("category")),
    summary: String(formData.get("summary")).trim(),
    roles,
    videoName: videoFile.name,
    videoBlob: videoFile,
  };

  await saveCustomWork(work);
  customWorks = await readCustomWorks();
  workForm.reset();
  activeFilter = "all";
  chips.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  renderWorks(activeFilter);
  formStatus.textContent = `已添加《${work.title}》。`;
});

(async function initWorks() {
  try {
    customWorks = await readCustomWorks();
    renderWorks();
  } catch (error) {
    renderWorks();
    formStatus.textContent = "浏览器本地存储暂不可用，仍可查看默认作品。";
  }
})();
