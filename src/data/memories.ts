/** Family photos live in public/photos; keep this list in story order. */
export type Memory = {
  id: string
  src: string
  caption: string
  moment?: string
  order: number
  inFinalCollage: boolean
  aspectRatio?: string
  alt: string
}

export const memories: Memory[] = [
  { id: '01', src: 'photos/01.jpg', moment: 'С самого начала', caption: 'С этого кадра началась наша общая история.', order: 1, inFinalCollage: true, aspectRatio: '2 / 3', alt: 'Папа держит маленького сына на руках' },
  { id: '02', src: 'photos/02.jpg', moment: 'Детство рядом', caption: 'Когда я был маленьким, рядом всегда был ты.', order: 2, inFinalCollage: false, aspectRatio: '1 / 2', alt: 'Папа и сын стоят вместе у воды' },
  { id: '03', src: 'photos/03.jpg', moment: 'Зимняя прогулка', caption: 'Наши прогулки, смех и маленькие приключения.', order: 3, inFinalCollage: false, aspectRatio: '4 / 3', alt: 'Папа и сын сидят зимой на скамейке с белой собакой' },
  { id: '04', src: 'photos/04.jpg', moment: 'Вместе', caption: 'Вместе — и в этом уже столько тепла.', order: 4, inFinalCollage: false, aspectRatio: '4 / 3', alt: 'Семейный портрет папы, сына и мамы' },
  { id: '05', src: 'photos/05.jpg', moment: 'Тёплый момент', caption: 'Такие мгновения хочется беречь особенно.', order: 5, inFinalCollage: false, aspectRatio: '4 / 3', alt: 'Папа, сын и мама улыбаются рядом' },
  { id: '06', src: 'photos/06.jpg', moment: 'Прогулка', caption: 'Просто день вместе. Именно такие дни и запоминаются.', order: 6, inFinalCollage: false, alt: 'Папа и сын обнимаются во время прогулки' },
  { id: '07', src: 'photos/07.jpg', moment: 'Выше облаков', caption: 'Мы вдвоём, дорога и целый мир впереди.', order: 7, inFinalCollage: false, alt: 'Папа и сын стоят вместе на фоне облаков' },
  { id: '08', src: 'photos/08.jpg', moment: 'На вершине', caption: 'Рядом с тобой каждая поездка становится историей.', order: 8, inFinalCollage: false, alt: 'Папа и сын поднимают руки на горном склоне' },
  { id: '09', src: 'photos/09.jpg', moment: 'За одним столом', caption: 'Разговоры за столом, которые остаются в памяти.', order: 9, inFinalCollage: false, alt: 'Папа и сын сидят с близким человеком за столом' },
  { id: '10', src: 'photos/10.jpg', moment: 'У моря', caption: 'Солнце, море и ещё один день, который мы провели вместе.', order: 10, inFinalCollage: true, alt: 'Папа и сын стоят рядом в море' },
  { id: '11', src: 'photos/11.jpg', moment: 'У водопада', caption: 'И снова мы рядом, где бы ни оказались.', order: 11, inFinalCollage: true, alt: 'Папа и сын стоят вместе перед водопадом' },
  { id: '12', src: 'photos/12.jpg', moment: 'Объятия', caption: 'Хорошо, когда можно просто обнять тебя.', order: 12, inFinalCollage: true, aspectRatio: '9 / 16', alt: 'Папа и сын обнимаются на террасе' },
  { id: '13', src: 'photos/13.jpg', moment: 'Твой портрет', caption: 'Твой спокойный взгляд и знакомое с детства тепло.', order: 13, inFinalCollage: false, alt: 'Папа сидит на скамейке осенью' },
  { id: '14', src: 'photos/14.jpg', moment: 'Рядом', caption: 'Люблю наши простые моменты рядом.', order: 14, inFinalCollage: true, alt: 'Папа и сын сидят рядом на скамейке' },
  { id: '15', src: 'photos/15.jpg', moment: 'Семья', caption: 'Семья рядом — самое ценное.', order: 15, inFinalCollage: false, aspectRatio: '4 / 3', alt: 'Сын, мама и папа фотографируются вместе' },
  { id: '16', src: 'photos/16.jpg', moment: 'Важный день', caption: 'Ты рядом в важный для меня день.', order: 16, inFinalCollage: true, alt: 'Папа и сын стоят вместе с дипломом' },
].sort((a, b) => a.order - b.order)
