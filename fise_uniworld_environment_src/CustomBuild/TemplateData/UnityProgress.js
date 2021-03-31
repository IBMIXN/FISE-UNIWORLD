function UnityProgress(unityInstance, progress) {
  if (!unityInstance.Module) return;
  if (!unityInstance.progress) {
    unityInstance.progress = document.createElement("div");
    unityInstance.progress.className = "progress";
    unityInstance.progress.full = document.createElement("div");
    unityInstance.progress.full.className = "full";
    unityInstance.progress.full.innerHTML = Math.round(100 * progress) + "%";
    unityInstance.progress.loadingText = document.createElement("span");
    unityInstance.progress.loadingText.className = "loadingText";
    unityInstance.progress.loadingText.innerHTML = "Loading... Please wait";
    unityInstance.progress.appendChild(unityInstance.progress.full);
    unityInstance.progress.appendChild(unityInstance.progress.loadingText);
    unityInstance.container.appendChild(unityInstance.progress);
  }
  unityInstance.progress.full.style.width = 100 * progress + "%";
  unityInstance.progress.full.innerHTML = Math.round(100 * progress) + "%";
  if (progress == 1) unityInstance.progress.style.display = "none";
}
