export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export namespace autoFit {
    export enum ScaleMode {
        NONE,
        WIDTH,
        HEIGHT,
        INSIDE,
        OUTSIDE,
    }

    export enum AlignMode {
        TL,
        TC,
        CC,
        BC,
        BL,
        NONE,
    }

    export function fit(
        targetArea: IRect,
        rSource: IRect,
        scaleMode: ScaleMode,
        alignMode: AlignMode = AlignMode.CC
    ): IRect {
        switch (scaleMode) {
            case ScaleMode.NONE:
                align(targetArea, rSource, alignMode);
                break;
            case ScaleMode.INSIDE:
                align(targetArea, proportional_inside(targetArea, rSource), alignMode);
                break;
            case ScaleMode.OUTSIDE:
                align(targetArea, proportional_outside(targetArea, rSource), alignMode);
                break;
            case ScaleMode.WIDTH:
                align(targetArea, width_only(targetArea, rSource), alignMode);
                break;
            case ScaleMode.HEIGHT:
                align(targetArea, height_only(targetArea, rSource), alignMode);
                break;
        }
        return rSource;
    }

    function width_only(targetArea: IRect, rSource: IRect): IRect {
        const s: number = targetArea.width / rSource.width;
        rSource.width *= s;
        rSource.height *= s;
        return rSource;
    }

    function height_only(targetArea: IRect, rSource: IRect): IRect {
        const s: number = targetArea.height / rSource.height;
        rSource.width *= s;
        rSource.height *= s;
        return rSource;
    }

    function proportional_inside(targetArea: IRect, rSource: IRect): IRect {
        const sx: number = targetArea.width / rSource.width;
        const sy: number = targetArea.height / rSource.height;
        const s: number = Math.min(sx, sy);
        rSource.width *= s;
        rSource.height *= s;
        return rSource;
    }

    function proportional_outside(targetArea: IRect, rSource: IRect): IRect {
        const sx: number = targetArea.width / rSource.width;
        const sy: number = targetArea.height / rSource.height;
        const s: number = Math.max(sx, sy);
        rSource.width = rSource.width * s;
        rSource.height = rSource.height * s;
        return rSource;
    }

    function align(targetArea: IRect, rSource: IRect, strAlign: AlignMode): IRect {
        switch (strAlign) {
            case AlignMode.TC:
                setCenter(targetArea, rSource, true, false);
                rSource.x = targetArea.x;
                break;
            case AlignMode.CC:
                setCenter(targetArea, rSource);
                break;
            case AlignMode.TL:
                rSource.x = targetArea.x;
                rSource.y = targetArea.y;
                break;
            case AlignMode.BC:
                setCenter(targetArea, rSource, true, false);
                rSource.y = targetArea.y + targetArea.height - rSource.height;
                break;
            case AlignMode.BL:
                rSource.x = targetArea.x;
                rSource.y = targetArea.y + targetArea.height - rSource.height;
                break;
            case AlignMode.NONE:
                //아무것도 안함.
                break;
        }
        return rSource;
    }

    export function setCenter(
        targetArea: IRect,
        rSource: IRect,
        axisX: Boolean = true,
        axisY: Boolean = true
    ): void {
        const r: IRect = targetArea;
        if (axisX) {
            rSource.x = r.x + r.width / 2 - rSource.width / 2;
        }
        if (axisY) {
            rSource.y = r.y + r.height / 2 - rSource.height / 2;
        }
    }
}
