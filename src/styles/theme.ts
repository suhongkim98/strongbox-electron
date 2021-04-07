import baseStyled, {
    css,
    CSSProp,
    ThemedStyledInterface,
} from 'styled-components';

/* PC , 테블릿 가로 (해상도 768px ~ 1023px)*/
/* 테블릿 세로 (해상도 768px ~ 1023px)*/
/* 모바일 가로, 테블릿 세로 (해상도 480px ~ 767px)*/
/* 모바일 가로, 테블릿 세로 (해상도 ~ 479px)*/
const sizes:{[key:string]: number} = {
	mobile: 479,
	tabletS: 480,
	tabletM: 768,
	desktopM: 1024,
	desktopL: 1201
}

type BackQuoteArgs = string[];

interface Media {
	mobile: (...args: BackQuoteArgs) => CSSProp | undefined,
	tabletS: (...args: BackQuoteArgs) => CSSProp | undefined,
	tabletM: (...args: BackQuoteArgs) => CSSProp | undefined,
	desktopM: (...args: BackQuoteArgs) => CSSProp | undefined,
	desktopL: (...args: BackQuoteArgs) => CSSProp | undefined,
}

const media: Media = {
	mobile: (...args: BackQuoteArgs) => undefined,
	tabletS: (...args: BackQuoteArgs) => undefined,
	tabletM: (...args: BackQuoteArgs) => undefined,
	desktopM: (...args: BackQuoteArgs) => undefined,
	desktopL: (...args: BackQuoteArgs) => undefined
};

//화면 사이즈에 따른 media 쿼리를 통한 자동 리사이징
/**사용 예시
 interface Text {
    text: string;
}
 const Box = styled.div<Text>`
    width: 200px;
    height 200px;
    border: 1px solid red;
    ${({theme}) => theme.media.desktopL`        
        border: 2px solid blue;
        ${(props: Text) => `&::before{
            content:"데스크톱 ${props.text}"
        }`};
    `}
    ${({theme}) => theme.media.tablet`
        border: 2px solid yellow;
        ${(props: Text) => `&::before{
            content:"태블릿 ${props.text}"
        }`}
    `}
    ${({theme}) => theme.media.mobile`
        border: 2px solid purple;
        ${(props: Text) => `&::before{
            content:"모바일 ${props.text}"
        }`}
    `}
`
 */
Object.keys(sizes).reduce((acc: Media, label: string) => {
	switch (label) {
		case 'desktopL':
			acc.desktopL = (...args: BackQuoteArgs) => css`
            @media only screen and (min-width: ${sizes.desktopL}px) {
                ${args}}`;
			break;
		case 'desktopM':
			acc.tabletM = (...args: BackQuoteArgs) => css`
			@media only screen and (max-width: ${sizes.desktopL}px) and (min-width: ${sizes.desktopM}px) {
				${args}}`;
			break;
		case 'tabletM':
			acc.tabletM = (...args: BackQuoteArgs) => css`
            @media only screen and (max-width: ${sizes.desktopM}px) and (min-width: ${sizes.tabletM}px) {
                ${args}}`;
            break;
        case 'tabletS':
             acc.tabletS = (...args: BackQuoteArgs) => css`
            @media only screen and (max-width: ${sizes.tabletM}px) and (min-width: ${sizes.tabletS}px) {
                ${args}}`;
            break;            
		case 'mobile':
			acc.mobile = (...args: BackQuoteArgs) => css`
            @media only screen and (max-width: ${sizes.tabletS}px) {
                ${args}}`;
			break;
		default:
			break;
	}
    return acc;
},media);

const colors = {
	white: '#ffffff',
	black: '#000000',
	backgroundMainColor: '#000430',
	lightPink: '#D98D8D',
	headerBackgroundColor: '#0F3460',
	navBackgroundColor: '#1A1A2E',
	containerMainColor: '#F8F8F8'
};

const secondaryColors = {};
const fontSizes: string[] = [];

const theme = {
	colors,
	fontSizes,
	secondaryColors,
	media
};

export type Theme = typeof theme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;
export default theme;