import { DomHelper } from './helpers';

const STYLES = `
    .loading{
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        font-size: 25px;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translateY(-30px);
        transition: 0.2s transform, 0.2s opacity;
        pointer-events: none;
    }
    .loading.--visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

export class Loading {
    constructor(props, setProps) {
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.loading = DomHelper.div('loading', props.target, 'Loading...');
        this.isLoading(props);
    }

    isLoading(props) {
        if (props.isLoading) {
            this.loading.classList.add('--visible');
        } else {
            this.loading.classList.remove('--visible');
        }
    }

    update(newProps) {
        this.isLoading(newProps);
    }

    init(newProps) {
        this.isLoading(newProps);
    }
}
