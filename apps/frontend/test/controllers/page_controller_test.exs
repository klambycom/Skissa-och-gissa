defmodule Frontend.PageControllerTest do
  use Frontend.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Skissa och gissa"
  end
end
