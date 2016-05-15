defmodule Frontend.Gettext do
  @moduledoc """
  A module providing Internationalization with a gettext-based API.

  See the [Gettext Docs](http://hexdocs.pm/gettext) for detailed usage.

  ## Example:

      import Frontend.Gettext

      # Simple translation
      gettext "Here is the string to translate"

      # Plural translation
      ngettext "Here is the string to translate",
               "Here are the strings to translate",
               3

      # Domain-based translation
      dgettext "errors", "Here is the error message to translate"

  ## Mix tasks

  When the text is translated it is important to run:

      mix gettext.extract

  To get new text to translate run:

      mix gettext.extract
      mix gettext.merge priv/gettext

  Or:

      mix gettext.extract --merge
  """

  use Gettext, otp_app: :frontend
end
