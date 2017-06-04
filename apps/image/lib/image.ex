defmodule Image do
  @moduledoc """
  Documentation for Image.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Image.hello
      :world

  """
  def hello do
    :world
  end

  def test do
    File.read!("test/images/basn0g01.png")
    |> Image.PNG.process
  end
end
