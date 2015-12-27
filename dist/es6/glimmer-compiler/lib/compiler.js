import { preprocess } from "glimmer-syntax";
import TemplateCompiler from "./template-compiler";
import { Template } from "glimmer-runtime";
/*
 * Compile a string into a template spec string. The template spec is a string
 * representation of a template. Usually, you would use compileSpec for
 * pre-compilation of a template on the server.
 *
 * Example usage:
 *
 *     var templateSpec = compileSpec("Howdy {{name}}");
 *     // This next step is basically what plain compile does
 *     var template = new Function("return " + templateSpec)();
 *
 * @method compileSpec
 * @param {String} string An Glimmer template string
 * @return {TemplateSpec} A template spec string
 */
export function compileSpec(string, options) {
    var ast = preprocess(string, options);
    var program = TemplateCompiler.compile(options, ast);
    return JSON.stringify(program);
}
/*
 * @method template
 * @param {TemplateSpec} templateSpec A precompiled template
 * @return {Template} A template spec string
 */
export function template(templateSpec) {
    return new Function("return " + templateSpec)();
}
/*
 * Compile a string into a template rendering function
 *
 * Example usage:
 *
 *     // Template is the hydration portion of the compiled template
 *     var template = compile("Howdy {{name}}");
 *
 *     // Template accepts three arguments:
 *     //
 *     //   1. A context object
 *     //   2. An env object
 *     //   3. A contextualElement (optional, document.body is the default)
 *     //
 *     // The env object *must* have at least these two properties:
 *     //
 *     //   1. `hooks` - Basic hooks for rendering a template
 *     //   2. `dom` - An instance of DOMHelper
 *     //
 *     import {hooks} from 'glimmer-runtime';
 *     import {DOMHelper} from 'morph';
 *     var context = {name: 'whatever'},
 *         env = {hooks: hooks, dom: new DOMHelper()},
 *         contextualElement = document.body;
 *     var domFragment = template(context, env, contextualElement);
 *
 * @method compile
 * @param {String} string An Glimmer template string
 * @param {Object} options A set of options to provide to the compiler
 * @return {Template} A function for rendering the template
 */
export function compile(string, options = {}) {
    let templateSpec = template(compileSpec(string, options));
    return Template.fromSpec(templateSpec);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnbGltbWVyLWNvbXBpbGVyL2xpYi9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQjtPQUNwQyxnQkFBZ0IsTUFBTSxxQkFBcUI7T0FDM0MsRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUI7QUFFMUM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCw0QkFBNEIsTUFBTSxFQUFFLE9BQU87SUFDekMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QyxJQUFJLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gseUJBQXlCLFlBQVk7SUFDbkMsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDO0FBQ2xELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEJHO0FBQ0gsd0JBQXdCLE1BQWMsRUFBRSxPQUFPLEdBQVMsRUFBRTtJQUN4RCxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSBcImdsaW1tZXItc3ludGF4XCI7XG5pbXBvcnQgVGVtcGxhdGVDb21waWxlciBmcm9tIFwiLi90ZW1wbGF0ZS1jb21waWxlclwiO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tIFwiZ2xpbW1lci1ydW50aW1lXCI7XG5cbi8qXG4gKiBDb21waWxlIGEgc3RyaW5nIGludG8gYSB0ZW1wbGF0ZSBzcGVjIHN0cmluZy4gVGhlIHRlbXBsYXRlIHNwZWMgaXMgYSBzdHJpbmdcbiAqIHJlcHJlc2VudGF0aW9uIG9mIGEgdGVtcGxhdGUuIFVzdWFsbHksIHlvdSB3b3VsZCB1c2UgY29tcGlsZVNwZWMgZm9yXG4gKiBwcmUtY29tcGlsYXRpb24gb2YgYSB0ZW1wbGF0ZSBvbiB0aGUgc2VydmVyLlxuICpcbiAqIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICAgIHZhciB0ZW1wbGF0ZVNwZWMgPSBjb21waWxlU3BlYyhcIkhvd2R5IHt7bmFtZX19XCIpO1xuICogICAgIC8vIFRoaXMgbmV4dCBzdGVwIGlzIGJhc2ljYWxseSB3aGF0IHBsYWluIGNvbXBpbGUgZG9lc1xuICogICAgIHZhciB0ZW1wbGF0ZSA9IG5ldyBGdW5jdGlvbihcInJldHVybiBcIiArIHRlbXBsYXRlU3BlYykoKTtcbiAqXG4gKiBAbWV0aG9kIGNvbXBpbGVTcGVjXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIEFuIEdsaW1tZXIgdGVtcGxhdGUgc3RyaW5nXG4gKiBAcmV0dXJuIHtUZW1wbGF0ZVNwZWN9IEEgdGVtcGxhdGUgc3BlYyBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVTcGVjKHN0cmluZywgb3B0aW9ucykge1xuICB2YXIgYXN0ID0gcHJlcHJvY2VzcyhzdHJpbmcsIG9wdGlvbnMpO1xuICB2YXIgcHJvZ3JhbSA9IFRlbXBsYXRlQ29tcGlsZXIuY29tcGlsZShvcHRpb25zLCBhc3QpO1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJvZ3JhbSk7XG59XG5cbi8qXG4gKiBAbWV0aG9kIHRlbXBsYXRlXG4gKiBAcGFyYW0ge1RlbXBsYXRlU3BlY30gdGVtcGxhdGVTcGVjIEEgcHJlY29tcGlsZWQgdGVtcGxhdGVcbiAqIEByZXR1cm4ge1RlbXBsYXRlfSBBIHRlbXBsYXRlIHNwZWMgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMpIHtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbihcInJldHVybiBcIiArIHRlbXBsYXRlU3BlYykoKTtcbn1cblxuLypcbiAqIENvbXBpbGUgYSBzdHJpbmcgaW50byBhIHRlbXBsYXRlIHJlbmRlcmluZyBmdW5jdGlvblxuICpcbiAqIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICAgIC8vIFRlbXBsYXRlIGlzIHRoZSBoeWRyYXRpb24gcG9ydGlvbiBvZiB0aGUgY29tcGlsZWQgdGVtcGxhdGVcbiAqICAgICB2YXIgdGVtcGxhdGUgPSBjb21waWxlKFwiSG93ZHkge3tuYW1lfX1cIik7XG4gKlxuICogICAgIC8vIFRlbXBsYXRlIGFjY2VwdHMgdGhyZWUgYXJndW1lbnRzOlxuICogICAgIC8vXG4gKiAgICAgLy8gICAxLiBBIGNvbnRleHQgb2JqZWN0XG4gKiAgICAgLy8gICAyLiBBbiBlbnYgb2JqZWN0XG4gKiAgICAgLy8gICAzLiBBIGNvbnRleHR1YWxFbGVtZW50IChvcHRpb25hbCwgZG9jdW1lbnQuYm9keSBpcyB0aGUgZGVmYXVsdClcbiAqICAgICAvL1xuICogICAgIC8vIFRoZSBlbnYgb2JqZWN0ICptdXN0KiBoYXZlIGF0IGxlYXN0IHRoZXNlIHR3byBwcm9wZXJ0aWVzOlxuICogICAgIC8vXG4gKiAgICAgLy8gICAxLiBgaG9va3NgIC0gQmFzaWMgaG9va3MgZm9yIHJlbmRlcmluZyBhIHRlbXBsYXRlXG4gKiAgICAgLy8gICAyLiBgZG9tYCAtIEFuIGluc3RhbmNlIG9mIERPTUhlbHBlclxuICogICAgIC8vXG4gKiAgICAgaW1wb3J0IHtob29rc30gZnJvbSAnZ2xpbW1lci1ydW50aW1lJztcbiAqICAgICBpbXBvcnQge0RPTUhlbHBlcn0gZnJvbSAnbW9ycGgnO1xuICogICAgIHZhciBjb250ZXh0ID0ge25hbWU6ICd3aGF0ZXZlcid9LFxuICogICAgICAgICBlbnYgPSB7aG9va3M6IGhvb2tzLCBkb206IG5ldyBET01IZWxwZXIoKX0sXG4gKiAgICAgICAgIGNvbnRleHR1YWxFbGVtZW50ID0gZG9jdW1lbnQuYm9keTtcbiAqICAgICB2YXIgZG9tRnJhZ21lbnQgPSB0ZW1wbGF0ZShjb250ZXh0LCBlbnYsIGNvbnRleHR1YWxFbGVtZW50KTtcbiAqXG4gKiBAbWV0aG9kIGNvbXBpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgQW4gR2xpbW1lciB0ZW1wbGF0ZSBzdHJpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgc2V0IG9mIG9wdGlvbnMgdG8gcHJvdmlkZSB0byB0aGUgY29tcGlsZXJcbiAqIEByZXR1cm4ge1RlbXBsYXRlfSBBIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKHN0cmluZzogc3RyaW5nLCBvcHRpb25zOiBPYmplY3Q9e30pIHtcbiAgbGV0IHRlbXBsYXRlU3BlYyA9IHRlbXBsYXRlKGNvbXBpbGVTcGVjKHN0cmluZywgb3B0aW9ucykpO1xuICByZXR1cm4gVGVtcGxhdGUuZnJvbVNwZWModGVtcGxhdGVTcGVjKTtcbn1cbiJdfQ==