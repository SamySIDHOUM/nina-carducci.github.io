(function() {
    const mauGallery = function(options) {
      let options = Object.assign({}, mauGallery.defaults, options);
      let tagsCollection = [];
      return this.forEach(function() {
        mauGallery.methods.createRowWrapper(this);
        if (options.lightBox) {
          mauGallery.methods.createLightBox(
            this,
            options.lightboxId,
            options.navigation
          );
        }
        mauGallery.listeners(options);
  
        Array.from(this.children)
          .filter(child => child.classList.contains("gallery-item"))
          .forEach(function(child, index) {
            mauGallery.methods.responsiveImageItem(child);
            mauGallery.methods.moveItemInRowWrapper(child);
            mauGallery.methods.wrapItemInColumn(child, options.columns);
            let theTag = child.dataset.galleryTag;
            if (
              options.showTags &&
              theTag !== undefined &&
              tagsCollection.indexOf(theTag) === -1
            ) {
              tagsCollection.push(theTag);
            }
          });
  
        if (options.showTags) {
          mauGallery.methods.showItemTags(
            this,
            options.tagsPosition,
            tagsCollection
          );
        }
  
        this.style.display = "block";
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
      let galleryItems = document.getElementsByClassName("gallery-item");
  
      Array.from(galleryItems).forEach(function(item) {
        item.addEventListener("click", function() {
          if (options.lightBox && this.tagName === "IMG") {
            mauGallery.methods.openLightBox(this, options.lightboxId);
          } else {
            return;
          }
        });
      });
  
      let gallery = document.querySelector(".gallery");
      gallery.addEventListener("click", function(event) {
        let target = event.target;
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
      createRowWrapper(element) {
        if (!element.children[0].classList.contains("row")) {
          let rowWrapper = document.createElement("div");
          rowWrapper.classList.add("gallery-items-row", "row");
          element.appendChild(rowWrapper);
        }
      },
      wrapItemInColumn(element, columns) {
        if (typeof columns === "number") {
          let columnWrapper = document.createElement("div");
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
            columnClasses +=  "col-md-" + Math.ceil(12 / columns.md);
          }
          if (columns.lg) {
            columnClasses +=  "col-lg-" + Math.ceil(12 / columns.lg);
          }
          if (columns.xl) {
            columnClasses += "col-xl-" + Math.ceil(12 / columns.xl);
          }
          let columnWrapper = document.createElement("div");
          columnWrapper.classList.add("item-column", "mb-4", columnClasses);
          element.parentNode.insertBefore(columnWrapper, element);
          columnWrapper.appendChild(element);
        } else {
          console.error(
            "Columns should be defined as numbers or objects. " + typeof columns + " is not supported."
          );
        }
      },
      moveItemInRowWrapper(element) {
        element.parentNode.parentNode.appendChild(element);
      },
      responsiveImageItem(element) {
        if (element.tagName === "IMG") {
          element.classList.add("img-fluid");
        }
      },
      openLightBox(element, lightboxId) {
        let lightboxImage = document
          .getElementById(lightboxId)
          .querySelector(".lightboxImage");
        lightboxImage.src = element.src;
        document.getElementById(lightboxId).classList.add("show");
      },
      prevImage(lightboxId) {
        let activeImage = null;
        Array.from(document.querySelectorAll("img.gallery-item")).forEach(
          function(image) {
            if (image.src === document.querySelector(".lightboxImage").src) {
              activeImage = image;
            }
          }
        );
        let activeTag = document.querySelector(
          ".tags-bar span.active-tag"
        ).dataset.imagesToggle;
        let imagesCollection = [];
        if (activeTag === "all") {
          Array.from(document.querySelectorAll(".item-column")).forEach(
            function(column) {
              if (column.children.length && column.children[0].tagName === "IMG") {
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
        let index = 0,
          next = null;
  
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
      nextImage(lightboxId) {
        let activeImage = null;
        Array.from(document.querySelectorAll("img.gallery-item")).forEach(
          function(image) {
            if (image.src === document.querySelector(".lightboxImage").src) {
              activeImage = image;
            }
          }
        );
        let activeTag = document.querySelector(
          ".tags-bar span.active-tag"
        ).dataset.imagesToggle;
        let imagesCollection = [];
        if (activeTag === "all") {
          Array.from(document.querySelectorAll(".item-column")).forEach(
            function(column) {
              if (column.children.length && column.children[0].tagName === "IMG") {
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
        let index = 0,
          next = null;
  
        imagesCollection.forEach(function(image, i) {
          if (activeImage.src === image.src) {
            index = i;
          }
        });
        next = imagesCollection[index] || imagesCollection[0];
        document.querySelector(".lightboxImage").src = next.src;
      },
      createLightBox(gallery, lightboxId, navigation) {
        let lightbox = document.createElement("div");
        lightbox.id = lightboxId ? lightboxId : "galleryLightbox";
        lightbox.classList.add("modal", "fade");
        lightbox.setAttribute("tabindex", "-1");
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-hidden", "true");
  
        let modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog");
        modalDialog.setAttribute("role", "document");
  
        let modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
  
        let modalBody = document.createElement("div");
        modalBody.classList.add("modal-body");
  
        if (navigation) {
          let prevButton = document.createElement("div");
          prevButton.classList.add("mg-prev");
          prevButton.style.cursor = "pointer";
          prevButton.style.position = "absolute";
          prevButton.style.top = "50%";
          prevButton.style.left = "-15px";
          prevButton.style.background = "white";
          prevButton.textContent = "<";
          modalBody.appendChild(prevButton);
        } else {
          let span = document.createElement("span");
          span.style.display = "none";
          modalBody.appendChild(span);
        }
  
        let lightboxImage = document.createElement("img");
        lightboxImage.classList.add("lightboxImage", "img-fluid");
        lightboxImage.alt = "Contenu de l'image affichée dans la modale au clique";
        modalBody.appendChild(lightboxImage);
  
        if (navigation) {
          let nextButton = document.createElement("div");
          nextButton.classList.add("mg-next");
          nextButton.style.cursor = "pointer";
          nextButton.style.position = "absolute";
          nextButton.style.top = "50%";
          nextButton.style.right = "-15px";
          nextButton.style.background = "white";
          nextButton.textContent = ">";
          modalBody.appendChild(nextButton);
        } else {
          let span = document.createElement("span");
          span.style.display = "none";
          modalBody.appendChild(span);
        }
  
        modalContent.appendChild(modalBody);
        modalDialog.appendChild(modalContent);
        lightbox.appendChild(modalDialog);
  
        gallery.appendChild(lightbox);
      },
      showItemTags(gallery, position, tags) {
        let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
        tags.forEach(function(value, index) {
          tagItems += '<li class="nav-item active"><span class="nav-link" data-images-toggle="' + value + '">' + value + '</span></li>';
        });
        let tagsRow = '<ul class="my-4 tags-bar nav nav-pills">' + tagItems + '</ul>';
  
        if (position === "bottom") {
          gallery.insertAdjacentHTML("beforeend", tagsRow);
        } else if (position === "top") {
          gallery.insertAdjacentHTML("afterbegin", tagsRow);
        } else {
          console.error("Unknown tags position: " + position);
        }
      },
      filterByTag() {
        if (this.classList.contains("active-tag")) {
          return;
        }
        let activeTags = document.querySelectorAll(".active-tag");
        activeTags.forEach(function(tag) {
          tag.classList.remove("active", "active-tag");
        });
        this.classList.add("active-tag");
  
        let tag = this.dataset.imagesToggle;
  
        Array.from(document.querySelectorAll(".gallery-item")).forEach(
          function(item) {
            let column = item.closest(".item-column");
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
  
    window.addEventListener("DOMContentLoaded", function() {
      let galleries = document.querySelectorAll(".gallery");
      Array.from(galleries).forEach(function(gallery) {
        mauGallery.call(gallery);
      });
    });
  })();
  