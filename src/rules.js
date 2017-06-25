const getTarget = (ctx, p) => {
  if (ctx == null) {
    return null;
  }
  if (p.length === 0) {
    return ctx;
  }
  ctx = ctx[p[0]];
  p.shift();
  return getTarget(ctx, p);
};

const bind = (target, method) => {
  if (target == null) {
    return;
  }
  if (target.on) {
    target.on(method);
    method(target());
  } else {
    method(target);
  }
};

const unbind = (target, method) => {
  if (target == null) {
    return;
  }
  if (target.off) {
    target.off(method);
  }
};

const getv = v => {
  if (v == null) {
    return v;
  }
  return v.on ? v() : v;
};

function handle(path, method) {
  let target;

  if (Array.isArray(path)) {
    path.forEach(pathItem => {
      handle.call(this, pathItem, method);
    });
    return;
  }

  const p = path.split(".");
  if (p[0] !== "data") {
    target = getTarget(this, [...p]);
    bind(target, method);
  } else {
    p.shift();
    this.on("set", data => {
      if (this.olddata) {
        target = getTarget(this.olddata, [...p]);
        unbind(target, method);
      }
      target = getTarget(data, [...p]);
      bind(target, method);
    });
  }
}

export const rules = {
  src: function(el, path) {
    handle.call(this, path, v => {
      el.setAttribute("src", getv(v));
    });
  },
  text: function(el, path) {
    handle.call(this, path, v => {
      el.textContent = getv(v);
    });
  },
  class: function(el, path, statement) {
    const className = statement.split(":")[2].trim();
    handle.call(this, path, v => {
      el.classList.toggle(className, getv(v));
    });
  },
  href: function(el, path) {
    handle.call(this, path, v => {
      el.setAttribute("href", getv(v));
    });
  },
  val: function(el, path) {
    handle.call(this, path, v => {
      el.value = getv(v);
    });
  },
  html: function(el, path) {
    handle.call(this, path, v => {
      el.innerHTML = getv(v);
    });
  },
  visible: function(el, path) {
    handle.call(this, path, v => {
      el.style.display = !getv(v) ? "none" : "";
    });
  },
  invisible: function(el, path) {
    handle.call(this, path, v => {
      el.style.display = !getv(v) ? "" : "none";
    });
  },
  enable: function(el, path) {
    handle.call(this, path, v => {
      el.classList.toggle("disabled", !getv(v));
    });
  },
  disable: function(el, path) {
    handle.call(this, path, v => {
      el.classList.toggle("disabled", getv(v));
    });
  },
  click: function(el, methodName) {
    el.addEventListener("click", () => {
      this[methodName].call(this, el);
      return false;
    });
  },
  prop: function(el, value) {
    this[value] = el;
  }
};
