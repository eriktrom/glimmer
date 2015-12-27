export class Opcode {
    constructor() {
        this.next = null;
        this.prev = null;
    }
}
export class UnflattenedOpcode extends Opcode {
    evaluate() {
        throw new Error("Unreachable");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bjb2Rlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItcnVudGltZS9saWIvb3Bjb2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFhQTtJQUFBO1FBRUUsU0FBSSxHQUFXLElBQUksQ0FBQztRQUNwQixTQUFJLEdBQVcsSUFBSSxDQUFDO0lBR3RCLENBQUM7QUFBRCxDQUFDO0FBRUQsdUNBQWdELE1BQU07SUFHcEQsUUFBUTtRQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpbmtlZExpc3QsIExpbmtlZExpc3ROb2RlLCBTbGljZSwgRGljdCB9IGZyb20gJ2dsaW1tZXItdXRpbCc7XG5pbXBvcnQgeyBWTSwgVXBkYXRpbmdWTSB9IGZyb20gJy4vdm0nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0aW5nT3Bjb2RlIGV4dGVuZHMgTGlua2VkTGlzdE5vZGUge1xuICB0eXBlOiBzdHJpbmc7XG4gIG5leHQ6IE9wY29kZTtcbiAgcHJldjogT3Bjb2RlO1xuXG4gIGV2YWx1YXRlKHZtOiBVcGRhdGluZ1ZNKTtcbn1cblxuZXhwb3J0IHR5cGUgVXBkYXRpbmdPcFNlcSA9IFNsaWNlPFVwZGF0aW5nT3Bjb2RlPjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE9wY29kZSBpbXBsZW1lbnRzIExpbmtlZExpc3ROb2RlIHtcbiAgdHlwZTogc3RyaW5nO1xuICBuZXh0OiBPcGNvZGUgPSBudWxsO1xuICBwcmV2OiBPcGNvZGUgPSBudWxsO1xuXG4gIGFic3RyYWN0IGV2YWx1YXRlKHZtOiBWTSk7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVbmZsYXR0ZW5lZE9wY29kZSBleHRlbmRzIE9wY29kZSB7XG4gIGFic3RyYWN0IGZsYXR0ZW4obGlzdDogT3Bjb2RlW10sIGxhYmVsczogRGljdDxudW1iZXI+KTtcblxuICBldmFsdWF0ZSgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlYWNoYWJsZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBPcFNlcSA9IFNsaWNlPE9wY29kZT47XG5leHBvcnQgdHlwZSBPcFNlcUJ1aWxkZXIgPSBMaW5rZWRMaXN0PE9wY29kZT47XG4iXX0=