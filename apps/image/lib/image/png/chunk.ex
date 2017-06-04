defmodule Image.PNG.Chunk do
  alias Image.PNG

  @ihdr_header <<?I, ?H, ?D, ?R>>
  @plte_header <<?P, ?L, ?T, ?E>>
  @idat_header <<?I, ?D, ?A, ?T>>
  @iend_header <<?I, ?E, ?N, ?D>>

  def decode(header, content, crc, image) do
    verify_crc!(header, content, crc)
    decode_chunk(header, content, image)
  end

  defp verify_crc!(header, content, valid_crc) do
    unless :erlang.crc32(header <> content) == valid_crc do
      raise("CRC for #{header} is invalid")
    end
  end

  # Header
  defp decode_chunk(
    "IHDR",
    <<
      width::integer-size(32),
      height::integer-size(32),
      bit_depth::integer,
      color_type::integer,
      compression::integer,
      filter_method::integer,
      interlace_method::integer
    >>,
    image
  ), do: %PNG{
    image |
    width: width,
    height: height,
    bit_depth: bit_depth,
    color_format: color_format(color_type),
    color_type: color_type,
    compression: compression_format(compression),
    filter_method: filter_method(filter_method),
    interlace_method: interlace_method
  }

  # Gamma
  defp decode_chunk("gAMA", <<gamma::integer-size(32)>>, image),
    do: %PNG{image | gamma: gamma / 100_000}

  # DataContent
  defp decode_chunk("IDAT", content, %PNG{data_content: data_content} = image),
    do: %PNG{image | data_content: data_content <> content}

  # End of file
  defp decode_chunk("IEND", _content, image), do: image # TODO Imagineer.Image.PNG.DataContent

  defp decode_chunk(header, content, image) do
    import IEx
    IEx.pry
  end

  defp color_format(0), do: :grayscale
  defp color_format(2), do: :rgb
  defp color_format(3), do: :palette
  defp color_format(4), do: :grayscale_alpha
  defp color_format(6), do: :rgb_alpha

  defp compression_format(0), do: :zlib

  defp filter_method(0), do: :five_basics
end
