mergeInto(LibraryManager.library, {
  OpenUrlTab: function (url) {
    window.open(Pointer_stringify(url), "_blank");
  },
});