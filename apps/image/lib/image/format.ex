defmodule Image.Format do
  @png_signature <<137::size(8), ?P, ?N, ?G, ?\r, ?\n, 26::size(8), ?\n>>

  @doc """
  Detect format.

  ## Example

      iex> File.read!("test/images/basn0g01.png")
      ...> |> Image.Format.detect
      :png
  """
  def detect(<<@png_signature, _rest::binary>>), do: :png
  def detect(_), do: :unknown
end
