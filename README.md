# My Personal FE lib


## Util
- Deferred

## DOM
https://github.com/react-bootstrap/dom-helpers
- events(on/off/once/delegate)
- ready
  var domReady = function(callback) {
      document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
  }


## Graphic
- ECS simple framework(Apple GameplayKit)
- Vec2
- Constraints(from Verlet)
