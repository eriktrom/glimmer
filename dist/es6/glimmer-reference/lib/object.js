// import { metaFor } from './meta';
// import { intern } from 'glimmer-util';
export function setProperty(parent, property, val) {
    // var rootProp = metaFor(parent).root().chainFor(intern(property));
    // var referencesToNotify = metaFor(parent).referencesFor(intern(property));
    parent[property] = val;
    // if (referencesToNotify) {
    //   referencesToNotify.forEach(function(ref) { ref.notify(); });
    // }
    // if (rootProp) rootProp.notify();
}
export function notifyProperty(parent, property) {
    // var rootProp = metaFor(parent).root().chainFor(intern(property));
    // var referencesToNotify = metaFor(parent).referencesFor(intern(property));
    // if (referencesToNotify) {
    //   referencesToNotify.forEach(function(ref) { ref.notify(); });
    // }
    // if (rootProp) rootProp.notify();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xpbW1lci1yZWZlcmVuY2UvbGliL29iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMseUNBQXlDO0FBRXpDLDRCQUE0QixNQUFXLEVBQUUsUUFBZ0IsRUFBRSxHQUFRO0lBQ2pFLG9FQUFvRTtJQUVwRSw0RUFBNEU7SUFFNUUsTUFBTSxDQUFTLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUUvQiw0QkFBNEI7SUFDNUIsaUVBQWlFO0lBQ2pFLElBQUk7SUFFSixtQ0FBbUM7QUFDckMsQ0FBQztBQUVELCtCQUErQixNQUFXLEVBQUUsUUFBZ0I7SUFDMUQsb0VBQW9FO0lBRXBFLDRFQUE0RTtJQUU1RSw0QkFBNEI7SUFDNUIsaUVBQWlFO0lBQ2pFLElBQUk7SUFFSixtQ0FBbUM7QUFDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IG1ldGFGb3IgfSBmcm9tICcuL21ldGEnO1xuLy8gaW1wb3J0IHsgaW50ZXJuIH0gZnJvbSAnZ2xpbW1lci11dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFByb3BlcnR5KHBhcmVudDogYW55LCBwcm9wZXJ0eTogc3RyaW5nLCB2YWw6IGFueSkge1xuICAvLyB2YXIgcm9vdFByb3AgPSBtZXRhRm9yKHBhcmVudCkucm9vdCgpLmNoYWluRm9yKGludGVybihwcm9wZXJ0eSkpO1xuXG4gIC8vIHZhciByZWZlcmVuY2VzVG9Ob3RpZnkgPSBtZXRhRm9yKHBhcmVudCkucmVmZXJlbmNlc0ZvcihpbnRlcm4ocHJvcGVydHkpKTtcblxuICBwYXJlbnRbPHN0cmluZz5wcm9wZXJ0eV0gPSB2YWw7XG5cbiAgLy8gaWYgKHJlZmVyZW5jZXNUb05vdGlmeSkge1xuICAvLyAgIHJlZmVyZW5jZXNUb05vdGlmeS5mb3JFYWNoKGZ1bmN0aW9uKHJlZikgeyByZWYubm90aWZ5KCk7IH0pO1xuICAvLyB9XG5cbiAgLy8gaWYgKHJvb3RQcm9wKSByb290UHJvcC5ub3RpZnkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmeVByb3BlcnR5KHBhcmVudDogYW55LCBwcm9wZXJ0eTogc3RyaW5nKSB7XG4gIC8vIHZhciByb290UHJvcCA9IG1ldGFGb3IocGFyZW50KS5yb290KCkuY2hhaW5Gb3IoaW50ZXJuKHByb3BlcnR5KSk7XG5cbiAgLy8gdmFyIHJlZmVyZW5jZXNUb05vdGlmeSA9IG1ldGFGb3IocGFyZW50KS5yZWZlcmVuY2VzRm9yKGludGVybihwcm9wZXJ0eSkpO1xuXG4gIC8vIGlmIChyZWZlcmVuY2VzVG9Ob3RpZnkpIHtcbiAgLy8gICByZWZlcmVuY2VzVG9Ob3RpZnkuZm9yRWFjaChmdW5jdGlvbihyZWYpIHsgcmVmLm5vdGlmeSgpOyB9KTtcbiAgLy8gfVxuXG4gIC8vIGlmIChyb290UHJvcCkgcm9vdFByb3Aubm90aWZ5KCk7XG59XG4iXX0=