defmodule Image do
  @moduledoc """
  Documentation for Image.
  """

  alias Image.Pixel

  defstruct width: 0, height: 0, pixels: []

  @doc """
  Create a new point in the image.

  ## Example:

      iex> %Image{width: 50, height: 50}
      ...> |> Image.add(3, 5, {200, 100, 50})
      ...> |> Image.add(3, 4)
      ...> |> Image.add(4, 3)
      ...> |> Image.add(5, 2, {100, 200, 45})
      %Image{
        width: 50,
        height: 50,
        pixels: [
          %Image.Pixel{x: 3, y: 5, rgb: {200, 100, 50}},
          %Image.Pixel{x: 3, y: 4, rgb: {200, 100, 50}},
          %Image.Pixel{x: 4, y: 3, rgb: {200, 100, 50}},
          %Image.Pixel{x: 5, y: 2, rgb: {100, 200, 45}}
        ]
      }

  Pixels outside of the image is removed:

      iex> %Image{width: 50, height: 50}
      ...> |> Image.add(3, 5, {200, 100, 50})
      ...> |> Image.add(3, 54)
      ...> |> Image.add(4, 3)
      ...> |> Image.add(-4, 3)
      %Image{
        width: 50,
        height: 50,
        pixels: [
          %Image.Pixel{x: 3, y: 5, rgb: {200, 100, 50}},
          %Image.Pixel{x: 4, y: 3, rgb: {200, 100, 50}}
        ]
      }
  """
  def add(image, x, y) do
    %Pixel{rgb: rgb} = List.last(image.pixels)
    add(image, x, y, rgb)
  end

  def add(image, x, y, _rgb) when x < 0 or y < 0, do: image

  def add(%Image{width: w, height: h} = image, x, y, _rgb) when x > w or y > h, do: image

  def add(image, x, y, rgb),
    do: %{image | pixels: image.pixels ++ [%Pixel{x: x, y: y, rgb: rgb}]}

  @doc """
  Get the last pixels in the image, i.e. remove overlapping pixels and return
  the last `%Image.Pixel{}` on each pixel in the image.

  ## Example:

      iex> %Image{width: 50, height: 50}
      ...> |> Image.add(3, 5, {200, 100, 50})
      ...> |> Image.add(3, 4)
      ...> |> Image.add(4, 3)
      ...> |> Image.add(5, 2, {100, 200, 45})
      ...> |> Image.add(5, 3)
      ...> |> Image.add(4, 3)
      ...> |> Image.current
      %Image{
        width: 50,
        height: 50,
        pixels: [
          %Image.Pixel{x: 3, y: 4, rgb: {200, 100, 50}},
          %Image.Pixel{x: 3, y: 5, rgb: {200, 100, 50}},
          %Image.Pixel{x: 4, y: 3, rgb: {100, 200, 45}},
          %Image.Pixel{x: 5, y: 2, rgb: {100, 200, 45}},
          %Image.Pixel{x: 5, y: 3, rgb: {100, 200, 45}}
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
