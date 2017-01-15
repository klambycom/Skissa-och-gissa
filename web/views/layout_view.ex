defmodule SkissaOchGissa.LayoutView do
  use SkissaOchGissa.Web, :view

  @doc """
  Get static files from the first part of the path in the url:

  - admin
  - game
  - and app for everything else
  """
  def static_file(%{path_info: ["admin" | _]}, type), do: get_path("admin", type)
  def static_file(%{path_info: ["games" | _]}, type), do: get_path("game", type)
  def static_file(_conn, type), do: get_path("app", type)

  @doc """
  Get flash element as p-tag

  ## Example

      iex> flash_element conn, :info, class: "alert"
      "<p class=\"alert\">Msg</p>"
  """
  def flash_element(conn, key, opts \\ %{}) do
    if get_flash(conn, key) != nil do
      content_tag :p, get_flash(conn, key), opts
    end
  end

  defp get_path(file, type), do: "/#{Atom.to_string(type)}/#{file}.#{Atom.to_string(type)}"
end
