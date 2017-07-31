(function () {
    'use strict';
    class Begin extends PageFragment {
        constructor(...args) {
            super(...args);
            this.Listeners = [
                {
                    selector: 'window',
                    type: 'resize',
                    action: this.elementsPositioning.bind(this, null, 'begin')
                },
                {
                    selector: 'body',
                    type: 'click',
                    action: function openingDoors() {
                        let leftDoorElement = document.getElementById('left-door'),
                            rightDoorElement = document.getElementById('right-door'),
                            leftDoorImage = leftDoorElement.querySelector('img'),
                            rightDoorImage = rightDoorElement.querySelector('img'),
                            _this = this;
                        rightDoorElement.classList.add('right-door-opening-begin');
                        leftDoorElement.classList.add('left-door-opening-begin');
                        rightDoorElement.addEventListener('transitionend', function imgChangeR() {
                            _this.elementsPositioning(_this, 'animation');
                            rightDoorImage.src = 'images/refrigerator/rightDoorOpened.png';
                            rightDoorElement.classList.add('right-door-opening-end');
                            rightDoorElement.addEventListener('transitionend', function animationEnd() {
                                setTimeout(function () {
                                    rightDoorElement.removeEventListener('transitionend', imgChangeR);
                                    rightDoorElement.removeEventListener('transitionend', animationEnd);
                                    window.location = `${URL_BEGIN}/index.html#main`;
                                }, 30);
                            });
                        });
                        leftDoorElement.addEventListener('transitionend', function imgChangeL() {
                            leftDoorImage.src = 'images/refrigerator/leftDoorOpened.png';
                            leftDoorElement.classList.add('left-door-opening-end');
                            leftDoorElement.removeEventListener('transitionend', imgChangeL);
                        });
                    }.bind(this)
                }
            ];

        }

        elementsPositioning(page, stage) {
            let leftDoorElement = document.getElementById('left-door'),
                rightDoorElement = document.getElementById('right-door'),
                leftDoorImage = leftDoorElement.querySelector('img'),
                rightDoorImage = rightDoorElement.querySelector('img'),
                nav = document.getElementById('navigation');
            let screenWidth = document.body.clientWidth,
                screenHeight = document.body.clientHeight - 2 * nav.offsetHeight,
                diff = screenHeight / screenWidth,
                leftDoorPositionOffset, rightDoorPositionOffset;
            if (stage === 'animation' && MAIN_PICTURE_DIFF <= diff) {
                leftDoorPositionOffset = 101;
                rightDoorPositionOffset = 135;
            } else if(stage === 'animation' && MAIN_PICTURE_DIFF > diff){
                leftDoorPositionOffset = 106;
                rightDoorPositionOffset = 132;
            } else if(stage === 'begin'){
                leftDoorPositionOffset = 109;
                rightDoorPositionOffset = 144;
            }
            if (MAIN_PICTURE_DIFF <= diff) {
                leftDoorImage.style.height = `${DOOR_IMG_HEIGHT * screenWidth / MAIN_PICTURE_WIDTH}px`;
                rightDoorImage.style.height = `${DOOR_IMG_HEIGHT * screenWidth / MAIN_PICTURE_WIDTH}px`;
                leftDoorElement.style.top = `${(100 - MAIN_PICTURE_DIFF / diff * 100) / 2}%`;
                rightDoorElement.style.top = `${(100 - MAIN_PICTURE_DIFF / diff * 100) / 2}%`;
                leftDoorElement.style.left = `${(leftDoorPositionOffset * screenWidth / MAIN_PICTURE_WIDTH)}px`;
                rightDoorElement.style.right = `${(rightDoorPositionOffset * screenWidth / MAIN_PICTURE_WIDTH)}px`;
            } else {
                leftDoorImage.style.height = `${DOOR_IMG_HEIGHT * screenHeight / MAIN_PICTURE_HEIGHT}px`;
                rightDoorImage.style.height = `${DOOR_IMG_HEIGHT * screenHeight / MAIN_PICTURE_HEIGHT}px`;
                leftDoorElement.style.top = `0`;
                rightDoorElement.style.top = `0`;
                leftDoorElement.style.left = `${(screenWidth - (MAIN_PICTURE_WIDTH -  leftDoorPositionOffset * 2) * screenHeight / MAIN_PICTURE_HEIGHT) / 2}px`;
                rightDoorElement.style.right = `${(screenWidth - (MAIN_PICTURE_WIDTH - rightDoorPositionOffset * 2) * screenHeight / MAIN_PICTURE_HEIGHT) / 2}px`;
            }
            return page;
        }

        displayPageFragment(page) {
            return super.displayPageFragment(page)
                .then(this.elementsPositioning(page, 'begin'))
        }
        destroyPageFragment(location) {
            let pageFragment = document.body.querySelector(`#${this.position}`);
            this.removeListeners();
            pageFragment.innerHTML = '';
        }
    }
    window.Begin = Begin;
}());