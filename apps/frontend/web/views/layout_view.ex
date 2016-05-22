defmodule Frontend.LayoutView do
  use Frontend.Web, :view

  @doc """
  Returns current locale.
  """
  def locale, do: Gettext.get_locale(Frontend.Gettext)

  @doc """
  Get flash element as p-tag.

  ## Example

      iex> flash_element conn, :info, class: "alert" # => <p class="alert">Msg</p>
  """
  def flash_element(conn, key, opts \\ %{}) do
    if get_flash(conn, key) != nil do
      content_tag :p, get_flash(conn, key), opts
    end
  end
end
