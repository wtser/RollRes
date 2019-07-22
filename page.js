(function() {
  const rollres = JSON.parse(localStorage.getItem("rollres")) || [];

  var $list = document.getElementById("list");
  var $addBtn = document.getElementById("addBtn");
  var $dialog = document.getElementById("dialog");
  var $deleteBtn = document.getElementById("deleteBtn");
  var $dialogForm = document.getElementById("dialogForm");
  var updateIndex = -1;

  function renderList(rollres) {
    $list.innerHTML = `${rollres.reduce((all, r, i) => {
      return (
        all +
        `<li data-index="${i}">
        <input type="checkbox" ${r.enable ? `checked` : ``}>
        <details ${$dialog ? `open` : ``}>
            <summary>${r.responseUrl}</summary>
            <pre>${r.requestUrl}</pre>
        </details>
        ${$dialog ? `<button type="button">edit</button>` : ``}
        
      </li>`
      );
    }, ``)}`;
  }

  renderList(rollres);

  $addBtn &&
    $addBtn.addEventListener("click", function onOpen() {
      updateIndex = -1;
      $dialog.showModal();
      $deleteBtn.setAttribute("hidden", true);
    });

  $dialog &&
    $dialog.addEventListener("close", function(event) {
      if ($dialog.returnValue === "yes") {
        const { responseUrl, requestUrl, enable } = $dialogForm.elements;
        const obj = {
          responseUrl: responseUrl.value,
          requestUrl: requestUrl.value,
          enable: enable.checked
        };

        if (updateIndex === -1) {
          rollres.push(obj);
        } else {
          rollres[updateIndex] = obj;
        }
        localStorage.setItem("rollres", JSON.stringify(rollres));

        renderList(rollres);
      }
    });

  $dialog &&
    $dialog.addEventListener("click", function(e) {
      if (e.target.tagName.toLowerCase() === "dialog") {
        $dialog.close();
      }
    });

  $deleteBtn &&
    $deleteBtn.addEventListener("click", function(e) {
      if (
        updateIndex !== -1 &&
        confirm(`Are you sure to remove ${rollres[updateIndex].responseUrl}?`)
      ) {
        rollres.splice(updateIndex, 1);
        localStorage.setItem("rollres", JSON.stringify(rollres));
        $dialog.close();
        renderList(rollres);
      }
    });

  $list.addEventListener("click", function(e) {
    updateIndex = e.target.parentElement.dataset.index;

    if (e.target.type === "checkbox") {
      rollres[updateIndex].enable = e.target.checked;
      localStorage.setItem("rollres", JSON.stringify(rollres));
    }

    if (e.target.type === "button") {
      const { responseUrl, requestUrl, enable } = $dialogForm.elements;
      responseUrl.value = rollres[updateIndex].responseUrl;
      requestUrl.value = rollres[updateIndex].requestUrl;
      enable.checked = rollres[updateIndex].enable;
      $dialog.showModal();
      $deleteBtn.removeAttribute("hidden");
    }
  });
})();
