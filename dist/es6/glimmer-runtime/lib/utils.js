import { intern } from 'glimmer-util';
export const EMPTY_ARRAY = [];
export const EMPTY_OBJECT = {};
const KEY = intern(`__glimmer${+new Date()}`);
export function symbol(debugName) {
    let num = Math.floor(Math.random() * (+new Date()));
    return intern(`${debugName} [id=${KEY}${num}]`);
}
export function turbocharge(object) {
    function Constructor() { }
    Constructor.prototype = object;
    return object;
}
export class ListRange {
    constructor(list, start, end) {
        this.list = list;
        this.start = start;
        this.end = end;
    }
    at(index) {
        if (index >= this.list.length)
            return null;
        return this.list[index];
    }
    min() {
        return this.start;
    }
    max() {
        return this.end;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnbGltbWVyLXJ1bnRpbWUvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYztBQUVyQyxhQUFhLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDOUIsYUFBYSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBRS9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFL0MsdUJBQXVCLFNBQVM7SUFDOUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELDRCQUE0QixNQUFjO0lBQ3hDLHlCQUF3QixDQUFDO0lBQ3pCLFdBQVcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQW9CRDtJQU9FLFlBQVksSUFBUyxFQUFFLEtBQWEsRUFBRSxHQUFXO1FBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxFQUFFLENBQUMsS0FBYTtRQUNkLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEdBQUc7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsR0FBRztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbnRlcm4gfSBmcm9tICdnbGltbWVyLXV0aWwnO1xuXG5leHBvcnQgY29uc3QgRU1QVFlfQVJSQVkgPSBbXTtcbmV4cG9ydCBjb25zdCBFTVBUWV9PQkpFQ1QgPSB7fTtcblxuY29uc3QgS0VZID0gaW50ZXJuKGBfX2dsaW1tZXIkeysgbmV3IERhdGUoKX1gKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHN5bWJvbChkZWJ1Z05hbWUpOiBzdHJpbmcge1xuICBsZXQgbnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCtuZXcgRGF0ZSgpKSk7XG4gIHJldHVybiBpbnRlcm4oYCR7ZGVidWdOYW1lfSBbaWQ9JHtLRVl9JHtudW19XWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHVyYm9jaGFyZ2Uob2JqZWN0OiBPYmplY3QpOiBPYmplY3Qge1xuICBmdW5jdGlvbiBDb25zdHJ1Y3RvcigpIHt9XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IG9iamVjdDtcbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuaW50ZXJmYWNlIEVudW1lcmFibGVDYWxsYmFjazxUPiB7XG4gIChpdGVtOiBUKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbnVtZXJhYmxlPFQ+IHtcbiAgZm9yRWFjaChjYWxsYmFjazogRW51bWVyYWJsZUNhbGxiYWNrPFQ+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZXN0cm95YWJsZSB7XG4gIGRlc3Ryb3koKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZTxUPiB7XG4gIG1pbigpOiBudW1iZXI7XG4gIG1heCgpOiBudW1iZXI7XG4gIGF0KGluZGV4OiBudW1iZXIpOiBUO1xufVxuXG5leHBvcnQgY2xhc3MgTGlzdFJhbmdlPFQ+IGltcGxlbWVudHMgUmFuZ2U8VD4ge1xuICBwcml2YXRlIGxpc3Q6IFRbXTtcblxuICAvLyBbc3RhcnQsIGVuZF1cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICBwcml2YXRlIGVuZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGxpc3Q6IFRbXSwgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIpIHtcbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGF0KGluZGV4OiBudW1iZXIpOiBUIHtcbiAgICBpZiAoaW5kZXggPj0gdGhpcy5saXN0Lmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMubGlzdFtpbmRleF07XG4gIH1cblxuICBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydDtcbiAgfVxuXG4gIG1heCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVuZDtcbiAgfVxufSJdfQ==