import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  function switchTo(lang: string) {
    void i18n.changeLanguage(lang)
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selector">
      <button
        onClick={() => { switchTo('pt') }}
        className={`text-label-lg px-2 py-0.5 rounded transition-colors duration-fast ${
          i18n.language === 'pt'
            ? 'text-accent font-semibold'
            : 'text-ink-400 hover:text-ink-600'
        }`}
        aria-pressed={i18n.language === 'pt'}
        lang="pt"
      >
        PT
      </button>
      <span className="text-ink-300 select-none" aria-hidden="true">|</span>
      <button
        onClick={() => { switchTo('en') }}
        className={`text-label-lg px-2 py-0.5 rounded transition-colors duration-fast ${
          i18n.language === 'en'
            ? 'text-accent font-semibold'
            : 'text-ink-400 hover:text-ink-600'
        }`}
        aria-pressed={i18n.language === 'en'}
        lang="en"
      >
        EN
      </button>
    </div>
  )
}
