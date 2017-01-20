export class Nutrient {
    constructor(
        public $key: string = '',
        public name: string = '',
        public category: string = '',
        public description: string = '',
        public classification: any[] = [],
        public functions: any[] = [],
        public diseasePrev: string[] = [],
        public intake: any = {},
        public nutrientRelationship: string = '',
        public deficiency: string = '',
        public toxicity: string = ''
    ) { }
}