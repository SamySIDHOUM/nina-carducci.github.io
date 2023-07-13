(function() {
  const mauGallery = function(options) {
    const mergedOptions = Object.assign({}, mauGallery.defaults, options);
    const tagsCollection = [];
    const elements = Array.from(this);

    elements.forEach(function(element) {
      mauGallery.methods.createRowWrapper(element);
      if (mergedOptions.lightBox) {
        mauGallery.methods.createLightBox(
          element,
          mergedOptions.lightboxId,
          mergedOptions.navigation
        );
      }
      mauGallery.listeners(mergedOptions);

      Array.from(element.children)
        .filter(function(child) {
          return child.classList.contains("gallery-item");
        })
        .forEach(function(child, index) {
          mauGallery.methods.responsiveImageItem(child);
          mauGallery.methods.moveItemInRowWrapper(child);
          mauGallery.methods.wrapItemInColumn(child, mergedOptions.columns);
          const theTag = child.dataset.galleryTag;
          if (
            mergedOptions.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (mergedOptions.showTags) {
        mauGallery.methods.showItemTags(
          element,
          mergedOptions.tagsPosition,
          tagsCollection
        );
      }

      element.style.display = "block";
    });
  };

  mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  mauGallery.listeners = function(options) {
    const galleryItems = document.getElementsByClassName("gallery-item");

    Array.from(galleryItems).forEach(function(item) {
      item.addEventListener("click", function() {
        if (options.lightBox && this.tagName === "IMG") {
          mauGallery.methods.openLightBox(this, options.lightboxId);
        } else {
          return;
        }
      });
    });

    const gallery = document.querySelector(".gallery");
    gallery.addEventListener("click", function(event) {
      const target = event.target;
      if (target.classList.contains("nav-link")) {
        mauGallery.methods.filterByTag.call(target);
      } else if (target.classList.contains("mg-prev")) {
        mauGallery.methods.prevImage(options.lightboxId);
      } else if (target.classList.contains("mg-next")) {
        mauGallery.methods.nextImage(options.lightboxId);
      }
    });
  };

  mauGallery.methods = {
    createRowWrapper: function(element) {
      if (!element.children[0].classList.contains("row")) {
        const rowWrapper = document.createElement("div");
        rowWrapper.classList.add("gallery-items-row", "row");
        element.appendChild(rowWrapper);
      }
    },
    wrapItemInColumn: function(element, columns) {
      if (typeof columns === "number") {
        const columnWrapper = document.createElement("div");
        columnWrapper.classList.add(
          "item-column",
          "mb-4",
          "col-" + Math.ceil(12 / columns)
        );
        element.parentNode.insertBefore(columnWrapper, element);
        columnWrapper.appendChild(element);
      } else if (typeof columns === "object") {
        let columnClasses = "";
        if (columns.xs) {
          columnClasses += "col-" + Math.ceil(12 / columns.xs);
        }
        if (columns.sm) {
          columnClasses += "col-sm-" + Math.ceil(12 / columns.sm);
        }
        if (columns.md) {
          columnClasses += "col-md-" + Math.ceil(12 / columns.md);
        }
        if (columns.lg) {
          columnClasses += "col-lg-" + Math.ceil(12 / columns.lg);
        }
        if (columns.xl) {
          columnClasses += "col-xl-" + Math.ceil(12 / columns.xl);
        }
        const columnWrapper = document.createElement("div");
        columnWrapper.classList.add("item-column", "mb-4", columnClasses);
        element.parentNode.insertBefore(columnWrapper, element);
        columnWrapper.appendChild(element);
      } else {
        console.error(
          "Columns should be defined as numbers or objects. " +
            typeof columns +
            " is not supported."
        );
      }
    },
    moveItemInRowWrapper: function(element) {
      element.parentNode.parentNode.appendChild(element);
    },
    responsiveImageItem: function(element) {
      if (element.tagName === "IMG") {
        element.classList.add("img-fluid");
      }
    },
    openLightBox: function(element, lightboxId) {
      const lightboxImage = document
        .getElementById(lightboxId)
        .querySelector(".lightboxImage");
      lightboxImage.src = element.src;
      document.getElementById(lightboxId).classList.add("show");
    },
    prevImage: function(lightboxId) {
      let activeImage = null;
      Array.from(document.querySelectorAll("img.gallery-item")).forEach(
        function(image) {
          if (image.src === document.querySelector(".lightboxImage").src) {
            activeImage = image;
          }
        }
      );
      const activeTag = document.querySelector(
        ".tags-bar span.active-tag"
      ).dataset.imagesToggle;
      const imagesCollection = [];
      if (activeTag === "all") {
        Array.from(document.querySelectorAll(".item-column")).forEach(
          function(column) {
            if (
              column.children.length &&
              column.children[0].tagName === "IMG"
            ) {
              imagesCollection.push(column.children[0]);
            }
          }
        );
      } else {
        Array.from(document.querySelectorAll(".item-column")).forEach(
          function(column) {
            if (
              column.children.length &&
              column.children[0].dataset.galleryTag === activeTag
            ) {
              imagesCollection.push(column.children[0]);
            }
          }
        );
      }
      let index = 0;
      let next = null;

      imagesCollection.forEach(function(image, i) {
        if (activeImage.src === image.src) {
          index = i;
        }
      });
      next =
        imagesCollection[index] ||
        imagesCollection[imagesCollection.length - 1];
      document.querySelector(".lightboxImage").src = next.src;
    },
    nextImage: function(lightboxId) {
      let activeImage = null;
      Array.from(document.querySelectorAll("img.gallery-item")).forEach(
        function(image) {
          if (image.src === document.querySelector(".lightboxImage").src) {
            activeImage = image;
          }
        }
      );
      const activeTag = document.querySelector(
        ".tags-bar span.active-tag"
      ).dataset.imagesToggle;
      const imagesCollection = [];
      if (activeTag === "all") {
        Array.from(document.querySelectorAll(".item-column")).forEach(
          function(column) {
            if (
              column.children.length &&
              column.children[0].tagName === "IMG"
            ) {
              imagesCollection.push(column.children[0]);
            }
          }
        );
      } else {
        Array.from(document.querySelectorAll(".item-column")).forEach(
          function(column) {
            if (
              column.children.length &&
              column.children[0].dataset.galleryTag === activeTag
            ) {
              imagesCollection.push(column.children[0]);
            }
          }
        );
      }
      let index = 0;
      let next = null;

      imagesCollection.forEach(function(image, i) {
        if (activeImage.src === image.src) {
          index = i;
        }
      });
      next = imagesCollection[index] || imagesCollection[0];
      document.querySelector(".lightboxImage").src = next.src;
    },
    createLightBox: function(gallery, lightboxId, navigation) {
      const lightbox = document.createElement("div");
      lightbox.id = lightboxId ? lightboxId : "galleryLightbox";
      lightbox.classList.add("modal", "fade");
      lightbox.setAttribute("tabindex", "-1");
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-hidden", "true");

      const modalDialog = document.createElement("div");
      modalDialog.classList.add("modal-dialog");
      modalDialog.setAttribute("role", "document");

      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");

      const modalBody = document.createElement("div");
      modalBody.classList.add("modal-body");

      if (navigation) {
        const prevButton = document.createElement("div");
        prevButton.classList.add("mg-prev");
        prevButton.style.cursor = "pointer";
        prevButton.style.position = "absolute";
        prevButton.style.top = "50%";
        prevButton.style.left = "-15px";
        prevButton.style.background = "white";
        prevButton.textContent = "<";
        modalBody.appendChild(prevButton);
      } else {
        const span = document.createElement("span");
        span.style.display = "none";
        modalBody.appendChild(span);
      }

      const lightboxImage = document.createElement("img");
      lightboxImage.classList.add("lightboxImage", "img-fluid");
      lightboxImage.alt =
        "Contenu de l'image affichée dans la modale au clique";
      modalBody.appendChild(lightboxImage);

      if (navigation) {
        const nextButton = document.createElement("div");
        nextButton.classList.add("mg-next");
        nextButton.style.cursor = "pointer";
        nextButton.style.position = "absolute";
        nextButton.style.top = "50%";
        nextButton.style.right = "-15px";
        nextButton.style.background = "white";
        nextButton.textContent = ">";
        modalBody.appendChild(nextButton);
      } else {
        const span = document.createElement("span");
        span.style.display = "none";
        modalBody.appendChild(span);
      }

      modalContent.appendChild(modalBody);
      modalDialog.appendChild(modalContent);
      lightbox.appendChild(modalDialog);

      gallery.appendChild(lightbox);
    },
    showItemTags: function(gallery, position, tags) {
      let tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      tags.forEach(function(value, index) {
        tagItems +=
          '<li class="nav-item active"><span class="nav-link" data-images-toggle="' +
          value +
          '">' +
          value +
          "</span></li>";
      });
      const tagsRow =
        '<ul class="my-4 tags-bar nav nav-pills">' + tagItems + "</ul>";

      if (position === "bottom") {
        gallery.insertAdjacentHTML("beforeend", tagsRow);
      } else if (position === "top") {
        gallery.insertAdjacentHTML("afterbegin", tagsRow);
      } else {
        console.error("Unknown tags position: " + position);
      }
    },
    filterByTag: function() {
      if (this.classList.contains("active-tag")) {
        return;
      }
      const activeTags = document.querySelectorAll(".active-tag");
      activeTags.forEach(function(tag) {
        tag.classList.remove("active", "active-tag");
      });
      this.classList.add("active-tag");

      const tag = this.dataset.imagesToggle;

      Array.from(document.querySelectorAll(".gallery-item")).forEach(
        function(item) {
          const column = item.closest(".item-column");
          column.style.display = "none";
          if (tag === "all") {
            column.style.display = "block";
          } else if (item.dataset.galleryTag === tag) {
            column.style.display = "block";
          }
        }
      );
    }
  };

  window.mauGallery = mauGallery;

  document.addEventListener("DOMContentLoaded", function() {
    const galleries = document.querySelectorAll(".gallery");
    Array.from(galleries).forEach(function(gallery) {
      mauGallery.call(gallery);
    });
  });
})();
