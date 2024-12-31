// Select all the span elements with class 'nums'
const nums = document.querySelectorAll('.nums span')

// Select the element with class 'counter'
const counter = document.querySelector('.counter')

// Select the element with class 'final'
const finalMessage = document.querySelector('.final')

// Select the element with id 'replay'
const replay = document.querySelector('#replay')

// Run the animation function
runAnimation()

// Function to reset the DOM elements to their initial state
function resetDOM() {
    // Remove 'hide' class from counter
    counter.classList.remove('hide')

    // Remove 'show' class from finalMessage
    finalMessage.classList.remove('show')

    // Reset class values for each num element
    nums.forEach((num) => {
        num.classList.value = ''
    })

    // Add 'in' class to the first num element
    nums[0].classList.add('in')
}

// Function to run the animation
function runAnimation() {
    // Iterate over each num element along with its index
    nums.forEach((num, idx) => {
        const nextToLast = nums.length - 1

        // Listen for animation end event
        num.addEventListener('animationend', (e) => {
            // Check if animation is 'goIn' and not the last num element
            if (e.animationName === 'goIn' && idx !== nextToLast) {
                num.classList.remove('in')
                num.classList.add('out')
            }
            // Check if animation is 'goOut' and there is a next sibling
            else if (e.animationName === 'goOut' && num.nextElementSibling) {
                num.nextElementSibling.classList.add('in')
            }
            // Otherwise, show the final message
            else {
                counter.classList.add('hide')
                finalMessage.classList.add('show')
            }
        })
    })
}

// Listen for click event on replay button
replay.addEventListener('click', () => {
    // Reset the DOM elements and run the animation again
    resetDOM()
    runAnimation()
})