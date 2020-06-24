<template>
  <div class="input" :class="{'float-label': float}">
		<input
			:type="type"
			v-bind:value="value"
			v-on:input="$emit('input', $event.target.value)"
			required></input>
		<span class="bar"></span>
		<label>{{label}}</label>
  </div>
</template>

<script>
export default {
  name: 'v-input',
	props: {
    float: Boolean,
		label: String,
		value: [String, Number],
    type: String,
	},
}
</script>

<style lang="scss">
.input {
	position: relative;
	padding-top: 12px;

	$transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  &.float-label {
    label {
			transform: translateY(-18px) scale(0.75);
    }
  }

	input {
		background: transparent;
		border-style: none;

		font-size: 16px;
		font-weight: 400;
		line-height: 20px;
		text-align: left;

		padding-top:    8px;
		padding-bottom: 8px;
    width: 100%;

		border-bottom: 1px solid darken($grey, 10%);
		&:focus {
			outline: none;
		}
    &:invalid {
    	box-shadow: none;
    }

		&:focus ~ label {
			color: $blue;
		}


		&:focus ~ label,
		&:valid ~ label {
			//top: -4px;
			//font-size: 12px;
			max-width: 100%;
			pointer-events: initial;
			transform: translateY(-18px) scale(0.75);
  	}

		&:focus ~.bar:before,
		&:focus ~.bar:after  {
			width: 50%;
		}
	}


	label {
		position: absolute;
		top: 18px;

		overflow: hidden;
		text-overflow: ellipsis;
		pointer-events: none;
		transform-origin: top left;
		transition: $transition;
		max-width: 90%;

		font-size: 15px;
		font-weight: 400;
		line-height: 20px;

		color: lighten($black, 25%);
		white-space: nowrap;
	}

	.bar {
		position: relative;
		display: block;
		width: 100%;
		&:before, &:after {
			content: '';
			height: 2px;
			width: 0;
			bottom: 0px;
			position: absolute;
			background: $blue;
			transition: $transition;
		}
		&:before {
			left: 50%;
		}
		&:after {
			right: 50%;
		}
	}
}
</style>
