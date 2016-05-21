defmodule Frontend.StaticHelpers do
  import Phoenix.Controller, only: [controller_module: 1]

  def css_path(conn), do: path(conn, :css)

  def js_path(conn), do: path(conn, :js)

  defp path(conn, filetype) do
    ft = Atom.to_string(filetype)
    static_path(conn, "/#{ft}/#{namespace controller_module(conn)}.#{ft}")
  end

  defp namespace(:"Elixir.Frontend.AdminController"), do: :admin
  defp namespace(_), do: :app

  defp static_path(%Plug.Conn{private: private}, path) do
    private.phoenix_endpoint.static_path(path)
  end
end
