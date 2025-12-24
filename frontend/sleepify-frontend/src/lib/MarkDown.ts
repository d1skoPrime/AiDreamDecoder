export function convertMarkdownToHTML(markdown: string): string {
  let html = markdown
  
  // Convert headers (### Header → <h3>Header</h3>)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-5">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-3 mt-5">$1</h1>')
  
  // Convert bold (**text** or __text__ → <strong>text</strong>)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>')
  
  // Convert italic (*text* or _text_ → <em>text</em>)
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>')
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p class="mb-3">')
  html = html.replace(/\n/g, '<br />')
  
  // Wrap in paragraph tags
  html = `<p class="mb-3">${html}</p>`
  
  return html
}