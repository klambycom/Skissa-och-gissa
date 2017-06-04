defmodule Image.PNG do
  @mime_type "image/png"

  defstruct width: 0,
            height: 0,
            bit_depth: 0,
            color_format: nil,
            color_type: nil,
            compression: nil,
            filter_method: nil,
            interlace_method: nil,
            gamma: nil,
            chunks: nil,
            mime_type: @mime_type,
            data_content: <<>>

  @png_signature <<137::size(8), ?P, ?N, ?G, ?\r, ?\n, 26::size(8), ?\n>>

  @doc """
  Detect format.

  ## Example

      iex> File.read!("test/images/basn0g01.png")
      ...> |> Image.PNG.process
      :todofix
  """
  def process(<<@png_signature, rest::binary>>), do: process(rest, %__MODULE__{})

  defp process(
    <<
      content_length::size(32),
      header::binary-size(4),
      content::binary-size(content_length),
      crc::size(32),
      rest::binary
    >>,
    image
  ) do
    process(rest, Image.PNG.Chunk.decode(header, content, crc, image))
  end
end
