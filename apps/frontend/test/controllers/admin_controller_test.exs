defmodule Frontend.AdminControllerTest do
  use Frontend.ConnCase

  test "GET /admin", %{conn: conn} do
    conn = get conn, "/admin"
    assert html_response(conn, 200) =~ "Skissaochgissa.se"
  end
end
