defmodule Frontend.LayoutView do
  use Frontend.Web, :view

  @doc """
  Returns current locale.
  """
  def locale, do: Gettext.get_locale(Frontend.Gettext)
end
