/* eslint-disable max-len */
export default () => {
    const green = 'color:#48D57C;font-weight:bold;';
    const blue = 'color:#6B8DF5;font-weight:bold;';
    const purple = 'color:#7B46E6;font-weight:bold;';
    const yellow = 'color:#F5CE10;font-weight:bold;';
    const red = 'color:#EF583C;font-weight:bold;';
    const black = 'color:black;font-weight:bold;';

    function isUA(userAgent: string) {
        return navigator.userAgent.toLowerCase().indexOf(userAgent) > -1;
    }

    if (typeof console === 'object' && console.log && typeof console.log === 'function') {
        if (isUA('chrome') && !isUA('edge')) {
            const bannerText = `
%c███████╗%c███╗   ██╗%c████████╗%c██████╗ %c██╗   ██╗ %c
%c██╔════╝%c████╗  ██║%c╚══██╔══╝%c██╔══██╗%c╚██╗ ██╔╝ %c   _     
%c█████╗  %c██╔██╗ ██║%c   ██║   %c██████╔╝%c ╚████╔╝  %c  |_|___ 
%c██╔══╝  %c██║╚██╗██║%c   ██║   %c██╔══██╗%c  ╚██╔╝   %c  | |_ -|
%c███████╗%c██║ ╚████║%c   ██║   %c██║  ██║%c   ██║    %c _| |___|
%c╚══════╝%c╚═╝  ╚═══╝%c   ╚═╝   %c╚═╝  ╚═╝%c   ╚═╝    %c|___|`;

            console.log(
                bannerText,
                green,
                blue,
                purple,
                yellow,
                red,
                black,
                green,
                blue,
                purple,
                yellow,
                red,
                black,
                green,
                blue,
                purple,
                yellow,
                red,
                black,
                green,
                blue,
                purple,
                yellow,
                red,
                black,
                green,
                blue,
                purple,
                yellow,
                red,
                black,
                green,
                blue,
                purple,
                yellow,
                red,
                black
            );
        } else {
            console.log(`
███████╗███╗   ██╗████████╗██████╗ ██╗   ██╗
██╔════╝████╗  ██║╚══██╔══╝██╔══██╗╚██╗ ██╔╝    _
█████╗  ██╔██╗ ██║   ██║   ██████╔╝ ╚████╔╝    |_|___
██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗  ╚██╔╝     | |_ -|
███████╗██║ ╚████║   ██║   ██║  ██║   ██║     _| |___|
╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝    |___|`);
        }
    }
};
