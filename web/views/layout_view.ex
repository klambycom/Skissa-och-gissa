defmodule SkissaOchGissa.LayoutView do
  use SkissaOchGissa.Web, :view

  def static_file(%{path_info: ["admin" | _]}, type), do: get_path("admin", type)
  def static_file(%{path_info: ["games" | _]}, type), do: get_path("game", type)
  def static_file(_conn, type), do: get_path("app", type)

  defp get_path(file, type), do: "/#{Atom.to_string(type)}/#{file}.#{Atom.to_string(type)}"
end
