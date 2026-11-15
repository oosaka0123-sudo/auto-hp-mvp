// No external SDK or analytics; canceling the native share dialog is not an error.
document.querySelectorAll('[data-ks-share]').forEach((button) => {
  const status = button.parentElement?.querySelector('[data-ks-share-status]');
  button.addEventListener('click', async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: location.href });
        if (status) status.textContent = '共有しました';
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(location.href);
        if (status) status.textContent = 'URLをコピーしました';
      } else {
        const input = document.createElement('textarea');
        input.value = location.href;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (status) status.textContent = copied ? 'URLをコピーしました' : 'URLをコピーできませんでした';
      }
    } catch (error) {
      if (error?.name !== 'AbortError' && status) status.textContent = '共有できませんでした';
    }
  });
});
