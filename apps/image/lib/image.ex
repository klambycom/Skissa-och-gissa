defmodule Image do
  @moduledoc """
  Documentation for Image.
  """

  alias Image.Pixel

  defstruct width: 0, height: 0, rgb: {0, 0, 0}, pixels: []

  @doc """
  Create a new point in the image.

  ## Example:

      iex> %Image{width: 50, height: 50, rgb: {200, 100, 50}}
      ...> |> Image.add(3, 5)
      ...> |> Image.add(3, 4)
      ...> |> Image.add(4, 3)
      ...> |> Image.add(5, 2)
      %Image{
        width: 50,
        height: 50,
        rgb: {200, 100, 50},
        pixels: [
          %Image.Pixel{x: 3, y: 5, rgb: {200, 100, 50}},
          %Image.Pixel{x: 3, y: 4, rgb: {200, 100, 50}},
          %Image.Pixel{x: 4, y: 3, rgb: {200, 100, 50}},
          %Image.Pixel{x: 5, y: 2, rgb: {200, 100, 50}}
        ]
      }

  Pixels outside of the image is removed:

      iex> %Image{width: 50, height: 50, rgb: {200, 100, 50}}
      ...> |> Image.add(3, 5)
      ...> |> Image.add(3, 54)
      ...> |> Image.add(4, 3)
      ...> |> Image.add(-4, 3)
      %Image{
        width: 50,
        height: 50,
        rgb: {200, 100, 50},
        pixels: [
          %Image.Pixel{x: 3, y: 5, rgb: {200, 100, 50}},
          %Image.Pixel{x: 4, y: 3, rgb: {200, 100, 50}}
        ]
      }
  """
  def add(image, x, y) when x < 0 or y < 0, do: image

  def add(%Image{width: w, height: h} = image, x, y) when x > w or y > h, do: image

  def add(image, x, y),
    do: %{image | pixels: image.pixels ++ [%Pixel{x: x, y: y, rgb: image.rgb}]}

  @doc """
  Set the color on the new pixels in the image from this point and forward.

  ## Examples:

      iex> %Image{width: 50, height: 50, rgb: {200, 100, 50}}
      ...> |> Image.set_color({100, 200, 100})
      %Image{width: 50, height: 50, rgb: {100, 200, 100}, pixels: []}

  The numbers can't be negative:

      iex> %Image{width: 50, height: 50, rgb: {200, 100, 50}}
      ...> |> Image.set_color({100, -200, 100})
      %Image{width: 50, height: 50, rgb: {200, 100, 50}, pixels: []}

  Or too big:

      iex> %Image{width: 50, height: 50, rgb: {200, 100, 50}}
      ...> |> Image.set_color({100, 200, 300})
      %Image{width: 50, height: 50, rgb: {200, 100, 50}, pixels: []}
  """
  def set_color(image, {r, g, b}) when r < 0 or g < 0 or b < 0, do: image
  def set_color(image, {r, g, b}) when r > 255 or g > 255 or b > 255, do: image
  def set_color(image, rgb), do: %{image | rgb: rgb}

  @doc """
  Get the last pixels in the image, i.e. remove overlapping pixels and return
  the last `%Image.Pixel{}` on each pixel in the image.

  ## Example:

      iex> %Image{width: 50, height: 50, rgb: {200, 100, 50}}
      ...> |> Image.add(3, 5)
      ...> |> Image.add(3, 4)
      ...> |> Image.add(4, 3)
      ...> |> Image.add(5, 2)
      ...> |> Image.add(5, 3)
      ...> |> Image.add(4, 3)
      ...> |> Image.current
      %Image{
        width: 50,
        height: 50,
        rgb: {200, 100, 50},
        pixels: [
          %Image.Pixel{x: 3, y: 4, rgb: {200, 100, 50}},
          %Image.Pixel{x: 3, y: 5, rgb: {200, 100, 50}},
          %Image.Pixel{x: 4, y: 3, rgb: {200, 100, 50}},
          %Image.Pixel{x: 5, y: 2, rgb: {200, 100, 50}},
          %Image.Pixel{x: 5, y: 3, rgb: {200, 100, 50}}
        ]
      }
  """
  def current(image), do: %{image | pixels: current_pixels(image.pixels, %{})}

  defp current_pixels([x|xs], result),
    do: current_pixels(xs, Map.put(result, {x.x, x.y}, x))

  defp current_pixels(_pixels, result), do: Map.values(result)

  # TODO Remove!
  def test do
    File.read!("test/images/basn0g01.png")
    |> Image.PNG.process
  end
end
