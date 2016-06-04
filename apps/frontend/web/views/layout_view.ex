defmodule Frontend.LayoutView do
  use Frontend.Web, :view

  @author "Christian Nilsson"
  @site_name dgettext "meta", "Skissa och gissa"
  @short_description dgettext "meta", "Skissa och gissa is a game where the players takes turn painting while the other players try to guess what are being painted."
  @default_type "website"

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

  @doc """
  Meta tags for Google and Facebook (or Open Graph, ogp.me).

  TODO Get canonical address for the given page (og:url)
  TODO og:image should be the painted image or some default.
  TODO twitter:image should be the painted image or some default.
  TODO Change twitter:site
  """
  def meta_tags(title, type \\ @default_type), do: [
    %{name: "description", content: @short_description},
    %{name: "author", content: @author},
    %{property: "og:title", content: title},
    %{property: "og:description", content: @short_description},
    %{property: "og:site_name", content: @site_name},
    %{property: "og:type", content: type},
    %{name: "twitter:card", content: "summary"},
    %{name: "twitter:site", content: "@klambycom"},
    %{name: "twitter:title", content: title},
    %{name: "twitter:description", content: @short_description}
  ]

  @doc """
  Create meta-tag.
  """
  def meta_tag(%{name: name, content: content}),
    do: tag :meta, name: name, content: content

  def meta_tag(%{property: property, content: content}),
    do: tag :meta, property: property, content: content

  @doc """
  Get the current user.
  """
  def current_user(conn), do: Guardian.Plug.current_resource(conn)
end
