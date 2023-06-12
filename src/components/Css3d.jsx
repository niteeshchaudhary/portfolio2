import { useEffect } from "react";
import jQuery from 'jquery';
export default function Css3d() {
    useEffect(()=>{
        
(function($) {
	
	var _animations = [ 'x-spin', 'y-spin', 'z-spin' ];
	var _currentTransition = 'flat';
	
	$('#ctrlAnimation').click(function(e) {
		var el = e.target;
		if (el.tagName == 'INPUT' && el.type == 'checkbox') {
			$('.stage .spin')
				.eq(_animations.indexOf(el.value))
				.toggleClass(el.value);
		}
	});
	
	$('#ctrlTransition').click(function(e) {
		var el = e.target;
		if (el.tagName == 'INPUT' && el.type == 'radio') {
			$('.object')
				.removeClass(_currentTransition)
				.addClass(el.value);
			_currentTransition = el.value;
		}
	});
	
})(jQuery);
    },[])
  return (
    <>
      <div class="container title">
        <h3>CSS3 Transition/Animation Test</h3>
      </div>

      <div class="container ctrls">
        <h3>settings</h3>
        <fieldset>
          <legend>animations</legend>
          <div id="ctrlAnimation">
            <label>
              <input type="checkbox" value="x-spin" checked="checked" /> x-spin
            </label>
            <label>
              <input type="checkbox" value="y-spin" checked="checked" /> y-spin
            </label>
            <label>
              <input type="checkbox" value="z-spin" checked="checked" /> z-spin
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>transition</legend>
          <div id="ctrlTransition">
            <label>
              <input
                type="radio"
                name="transition"
                value="flat"
                checked="checked"
              />{" "}
              flat
            </label>
            <label>
              <input type="radio" name="transition" value="cube" /> cube
            </label>
            <label>
              <input type="radio" name="transition" value="ring" /> ring
            </label>
            <label>
              <input type="radio" name="transition" value="stack" /> stack
            </label>
          </div>
        </fieldset>
      </div>

      <div class="stage">
        <div class="spin x-spin">
          <div class="spin y-spin">
            <div class="spin z-spin">
              <div class="object flat">
                <div class="face face-1">1</div>
                <div class="face face-2">2</div>
                <div class="face face-3">3</div>
                <div class="face face-4">4</div>
                <div class="face face-5">5</div>
                <div class="face face-6">6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
