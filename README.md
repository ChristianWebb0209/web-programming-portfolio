

# Approach brainstorm

## Content:

- Top navigation 
    - web component, I should do some cool CSS animation stuff for this
- About page
    - Introuce myself, maybe take from a previous cover letter
    - What cool visual attention getter could I put here?
- Resume page
    - Download button at the top
    - Maybe have pdf viewer right there? This would be an acceptable dependency to use I think in prof's eyes
- Projects page
    - Probably just talk about Unreal AI Editor (my main project)
    - Maybe something about the game we made in 305?
    - Maybe a video demonstration of project?
- Contact me page
    - Standard HTML form that sends an email to my burner email
    - It should create the message with a note at the top specifying it came from this site

## Aesthetic:

132a13
31572c
4f772d
90a955
ecf39e

Maybe I will try EB Garamond for the font? I used it for another project and it looked pretty cool.

## Links and stuff to include:

https://github.com/ChristianWebb0209
https://www.linkedin.com/in/christian-webb-76530928a/

Resume:
https://docs.google.com/document/d/1uA3yp7Osdv8o6sY6v0ztBBa68W3MHB0ryZLXkAGMUyE/edit?usp=sharing

https://github.com/ChristianWebb0209/unreal-engine-ai-assistant

### Talk about my project I've been building:

One challenge I faced was making a tooling layer that could create blueprints (the visual scripting language used in Unreal), since there are many different types of them, and all of the formatting is somewhat obscure, so the LLMs don’t have much if any training data. My solution was to make about a dozen agent types for specific blueprint types, then have one main orchestration agent that didn’t have the power to mutate anything, and would just create subtasks and delegate to the appropriate subagent. This main agent was only given a few tools, but was given a detailed description of each subagent type at its disposal and what they were capable of. This allowed me to put a lot more useful stuff about formatting and fit a lot more tool schemas in the context windows of each call to a subagent, which both led to higher accuracy and actually successfully mutating the blueprints, but this also led to the drawback of being slower and requiring more LLM roundtrips, and also using more tokens.

Another challenge is that Unreal Engine projects are massive, usually dozens of gigabytes, so my agents constantly hallucinated paths to assets that they thought existed. My solution was to establish a heuristic throughout all of the prompt chunks that any mutation must be preceded by a discovery phase, meaning unless the path to an asset was already given (since the most likely paths are usually included in the context window already), the agent must run grep tools / do some sort of discovery to verify the path before mutating.


