export default function formatDate (date:Date) {
    const Dates = new Date(date).toLocaleDateString('th-TH', { year: '2-digit',month: 'short',day: 'numeric',hour: 'numeric',minute:'numeric',second:'numeric',timeZone: 'Asia/Bangkok' })
    return Dates;
}