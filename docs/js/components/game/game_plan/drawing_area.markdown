

<!-- Start src/components/game/game_plan/drawing_area.js -->

## Point

Represents a Point.

### Params:

* **** *x* {int} The x cordination.
* **** *y* {int} The y cordination.
* **** *dragging* {boolean} True if not the first point.
* **** *color* {string} The color of the point.
* **** *size* {int} The size of the point.

## data()

Get all data about the point.

### Return:

* **Object** Returns a object with all data (x, y, color, size, dragging).

## add(x, y, dragging)

Add a new Point to the drawing.

### Params:

* **** *x* {int} The x cordination.
* **** *y* {int} The y cordination.
* **** *dragging* {boolean} True if its not the first point in current line.

### Return:

* **** Returns the newly created Point.

## setColor(c)

Set the color. All points after the color is changed till its
changed again will have the same color.

### Params:

* **** *c* {string} The new color.

## setSize(s)

Set the size. All points after the size is changed til its changed
again will have the same size.

### Params:

* **** *s* {int} The new size.

## clear()

Remove all points.

## each(fn)

Iterate through each point.

### Params:

* **** *fn* {function} Callback function that takes two parameters                      (previous and current). Previous is undefined
                     if its the first point.

## last(fn)

Gets the previous and the current point.

### Params:

* **** *fn* {function} Callbakc function that takes two parameters                      (previous and current). Previous is undefined
                     if its the first point.

<!-- End src/components/game/game_plan/drawing_area.js -->

