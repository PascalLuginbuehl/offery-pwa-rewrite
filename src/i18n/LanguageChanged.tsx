import { useTranslation } from "react-i18next"

export default function LanguageChanged() {
  const { i18n } = useTranslation()
  // const { me } = useSelector((state: ApplicationState) => state.misc)

  // React.useEffect(() => {
  //   if (me) {
  //     const lng = me.settingsLanguageKey
  //     if (i18n.language !== lng) {
  //       i18n.changeLanguage(lng)
  //     }
  //   }
  // }, [i18n, me])

  return null
}
